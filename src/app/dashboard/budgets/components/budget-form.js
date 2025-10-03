import { useEffect, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { budgetValidationSchema } from '../validation';
import { BUDGET_PERIOD_OPTIONS } from '@/constants/budget-constants';
import { currencyService, categoryService } from '@/services';

const BudgetForm = ({
  isVisible,
  setIsVisible,
  selectedBudget,
  setSelectedBudget,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(null);
  const [currencyId, setCurrencyId] = useState(null);
  const [period, setPeriod] = useState(2);
  const [startDate, setStartDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [categoryAllocations, setCategoryAllocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (isVisible) {
      fetchCurrencies();
      fetchCategories();
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedBudget) {
      setName(selectedBudget.name || '');
      setAmount(selectedBudget.amount || null);
      setCurrencyId(selectedBudget.currencyId || null);
      setPeriod(selectedBudget.period ?? 2);
      setStartDate(selectedBudget.startDate ? new Date(selectedBudget.startDate) : new Date());
      setDescription(selectedBudget.description || '');
      setIsActive(selectedBudget.isActive ?? true);
      setCategoryAllocations(selectedBudget.categories || []);
    }
  }, [selectedBudget]);

  const fetchCurrencies = async () => {
    try {
      const response = await currencyService.getActiveCurrencies();
      setCurrencies(response);
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      name,
      amount,
      currencyId,
      period,
      startDate: startDate.toISOString(),
      description: description || null,
      categoryAllocations: categoryAllocations.map(ca => ({
        categoryId: ca.categoryId,
        amount: ca.amount,
      })),
      isActive,
    };

    let fieldErrors = {};
    const { error } = budgetValidationSchema.validate(payload, { allowUnknown: true, abortEarly: false });

    if (error) {
      error.details.forEach((detail) => {
        fieldErrors[detail.context.key] = detail.message;
      });
    }

    if (categoryAllocations.length > 0) {
      const totalAllocated = categoryAllocations.reduce((sum, ca) => sum + (ca.amount || 0), 0);
      if (totalAllocated > amount) {
        fieldErrors.categoryAllocations = 'Total category allocations cannot exceed budget amount';
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors({ ...fieldErrors });
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      await onSubmit(payload, selectedBudget?.id);
      clearForm();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setName('');
    setAmount(null);
    setCurrencyId(null);
    setPeriod(2);
    setStartDate(new Date());
    setDescription('');
    setIsActive(true);
    setCategoryAllocations([]);
    setSelectedBudget(null);
    setErrors({});
    setSelectedCategories([]);
    setIsVisible(false);
  };

  const handleCancel = () => {
    clearForm();
  };

  const handleAddCategory = () => {
    if (!selectedCategories || selectedCategories.length === 0) return;

    const newAllocations = [...categoryAllocations];
    const categoriesToAdd = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
    
    categoriesToAdd.forEach(cat => {
      if (!newAllocations.find(a => a.categoryId === cat.id)) {
        newAllocations.push({
          categoryId: cat.id,
          categoryName: cat.name,
          amount: 0,
        });
      }
    });
    setCategoryAllocations(newAllocations);
    setSelectedCategories([]);
  };

  const handleRemoveCategory = (categoryId) => {
    setCategoryAllocations(categoryAllocations.filter(ca => ca.categoryId !== categoryId));
  };

  const handleCategoryAmountChange = (categoryId, value) => {
    setCategoryAllocations(categoryAllocations.map(ca =>
      ca.categoryId === categoryId ? { ...ca, amount: value } : ca
    ));
  };

  const categoryAmountTemplate = (rowData) => {
    return (
      <InputNumber
        value={rowData.amount}
        onValueChange={(e) => handleCategoryAmountChange(rowData.categoryId, e.value)}
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={2}
        min={0.01}
        className="w-full"
      />
    );
  };

  const categoryActionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-times"
        rounded
        text
        severity="danger"
        onClick={() => handleRemoveCategory(rowData.categoryId)}
      />
    );
  };

  const totalAllocated = categoryAllocations.reduce((sum, ca) => sum + (ca.amount || 0), 0);
  const remainingBudget = (amount || 0) - totalAllocated;

  const headerText = selectedBudget ? 'Edit Budget' : 'Add New Budget';
  const actionButtonLabel = selectedBudget ? 'Update' : 'Add';

  return (
    <Sidebar
      header={headerText}
      className="w-full md:w-30rem lg:w-35rem"
      visible={isVisible}
      position="right"
      onHide={handleCancel}
      blockScroll
    >
      <div className="flex flex-column gap-3 pt-3">
        <div className="flex flex-column gap-2">
          <label className="font-semibold">Budget Name</label>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'p-invalid' : ''}
            placeholder="Enter budget name"
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Budget Amount</label>
          <InputNumber
            value={amount}
            onValueChange={(e) => setAmount(e.value)}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            min={0.01}
            max={999999999.99}
            className={errors.amount ? 'p-invalid w-full' : 'w-full'}
            placeholder="0.00"
          />
          {errors.amount && <small className="p-error">{errors.amount}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Currency</label>
          <Dropdown
            value={currencyId}
            options={currencies}
            onChange={(e) => setCurrencyId(e.value)}
            optionLabel="name"
            optionValue="id"
            placeholder="Select currency"
            className={errors.currencyId ? 'p-invalid w-full' : 'w-full'}
            filter
            appendTo="self"
          />
          {errors.currencyId && <small className="p-error">{errors.currencyId}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Budget Period</label>
          <Dropdown
            value={period}
            options={BUDGET_PERIOD_OPTIONS}
            onChange={(e) => setPeriod(e.value)}
            optionLabel="label"
            optionValue="value"
            placeholder="Select period"
            className={errors.period ? 'p-invalid w-full' : 'w-full'}
            appendTo="self"
          />
          {errors.period && <small className="p-error">{errors.period}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Start Date</label>
          <Calendar
            value={startDate}
            onChange={(e) => setStartDate(e.value)}
            dateFormat="yy-mm-dd"
            minDate={new Date()}
            className={errors.startDate ? 'p-invalid w-full' : 'w-full'}
            placeholder="Select start date"
            showIcon
          />
          {errors.startDate && <small className="p-error">{errors.startDate}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Description (Optional)</label>
          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? 'p-invalid w-full' : 'w-full'}
            placeholder="Add budget description..."
            rows={3}
            maxLength={500}
          />
          {errors.description && <small className="p-error">{errors.description}</small>}
        </div>

        {selectedBudget && (
          <div className="flex align-items-center gap-2">
            <Checkbox
              inputId="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.checked)}
            />
            <label htmlFor="isActive" className="font-semibold">Active Budget</label>
          </div>
        )}

        <div className="flex flex-column gap-2 pt-3 border-top-1 surface-border">
          <label className="font-semibold">Category Allocations (Optional)</label>
          
          <div className="flex gap-2">
            <Dropdown
              value={selectedCategories}
              options={categories.filter(c => c.isActive && !categoryAllocations.find(ca => ca.categoryId === c.id))}
              onChange={(e) => setSelectedCategories(e.value || [])}
              optionLabel="name"
              placeholder="Select categories"
              className="flex-1"
              filter
              showClear
              multiple
              appendTo="self"
            />
            <Button
              icon="pi pi-plus"
              onClick={handleAddCategory}
              disabled={!selectedCategories || selectedCategories.length === 0}
            />
          </div>

          {categoryAllocations.length > 0 && (
            <div className="mt-2">
              <DataTable value={categoryAllocations} size="small">
                <Column field="categoryName" header="Category" />
                <Column body={categoryAmountTemplate} header="Amount" />
                <Column body={categoryActionTemplate} style={{ width: '3rem' }} />
              </DataTable>
              
              <div className="mt-2 p-2 surface-100 border-round">
                <div className="flex justify-content-between mb-1">
                  <span>Total Allocated:</span>
                  <span className="font-semibold">{totalAllocated.toFixed(2)}</span>
                </div>
                <div className="flex justify-content-between">
                  <span>Remaining:</span>
                  <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {remainingBudget.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          {errors.categoryAllocations && <small className="p-error">{errors.categoryAllocations}</small>}
        </div>

        <div className="flex gap-2 pt-3 border-top-1 surface-border">
          <Button 
            label={actionButtonLabel} 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoading}
            className="flex-1"
          />
          <Button 
            label="Cancel" 
            severity="secondary"
            onClick={handleCancel} 
            disabled={isSubmitting || isLoading}
            className="flex-1"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default BudgetForm;