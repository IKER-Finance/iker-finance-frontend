import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { transactionValidationSchema } from '../validation';
import { TRANSACTION_TYPE_OPTIONS, TRANSACTION_TYPE_ENUM } from '@/constants/transaction-constants';
import { currencyService, categoryService, budgetService } from '@/services';
import BudgetImpactPreview from '@/components/budgets/budget-impact-preview';

const TransactionForm = ({
  isVisible,
  setIsVisible,
  selectedTransaction,
  setSelectedTransaction,
  onSubmit,
  isLoading,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [currencyId, setCurrencyId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetImpact, setBudgetImpact] = useState(null);
  const [budgetImpactLoading, setBudgetImpactLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchCurrencies();
      fetchCategories();
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedTransaction) {
      setDescription(selectedTransaction.description || '');
      setAmount(selectedTransaction.amount || null);
      setCategoryId(selectedTransaction.categoryId || null);
      setCurrencyId(selectedTransaction.currencyId || null);
      setDate(selectedTransaction.date ? new Date(selectedTransaction.date) : new Date());
      setNotes(selectedTransaction.notes || '');
    }
  }, [selectedTransaction]);

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

  const fetchBudgetImpact = useCallback(async () => {
    // Only fetch if we have all required fields and it's a new transaction (not editing)
    if (!amount || amount <= 0 || !categoryId || !currencyId || !date || selectedTransaction) {
      setBudgetImpact(null);
      return;
    }

    try {
      setBudgetImpactLoading(true);
      const impactData = await budgetService.previewBudgetImpact({
        amount,
        categoryId,
        transactionDate: date.toISOString(),
        currencyId
      });
      setBudgetImpact(impactData);
    } catch (error) {
      console.error('Failed to fetch budget impact:', error);
      setBudgetImpact(null);
    } finally {
      setBudgetImpactLoading(false);
    }
  }, [amount, categoryId, currencyId, date, selectedTransaction]);

  // Fetch budget impact when relevant fields change
  useEffect(() => {
    // Debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (isVisible && amount && categoryId && currencyId && date && !selectedTransaction) {
        fetchBudgetImpact();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [amount, categoryId, currencyId, date, isVisible, selectedTransaction, fetchBudgetImpact]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      amount,
      currencyId,
      description,
      notes: notes || null,
      date: date.toISOString(),
      categoryId,
    };

    let fieldErrors = {};
    const { error } = transactionValidationSchema.validate(payload, { allowUnknown: true, abortEarly: false });

    if (error) {
      error.details.forEach((detail) => {
        fieldErrors[detail.context.key] = detail.message;
      });
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors({ ...fieldErrors });
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    try {
      await onSubmit(payload, selectedTransaction?.id);
      clearForm();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setDescription('');
    setAmount(null);
    setCategoryId(null);
    setCurrencyId(null);
    setDate(new Date());
    setNotes('');
    setSelectedTransaction(null);
    setErrors({});
    setBudgetImpact(null);
    setBudgetImpactLoading(false);
    setIsVisible(false);
  };

  const handleCancel = () => {
    clearForm();
  };

  const headerText = selectedTransaction ? 'Edit Transaction' : 'Add New Transaction';
  const actionButtonLabel = selectedTransaction ? 'Update' : 'Add';

  return (
    <Sidebar
      header={headerText}
      className="w-full md:w-30rem"
      visible={isVisible}
      position="right"
      onHide={handleCancel}
      blockScroll
    >
      <div className="flex flex-column gap-3 pt-3">
        <div className="flex flex-column gap-2">
          <label className="font-semibold">Description</label>
          <InputText
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? 'p-invalid' : ''}
            placeholder="Enter transaction description"
          />
          {errors.description && <small className="p-error">{errors.description}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Amount</label>
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
          />
          {errors.currencyId && <small className="p-error">{errors.currencyId}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Category</label>
          <Dropdown
            value={categoryId}
            options={categories}
            onChange={(e) => setCategoryId(e.value)}
            optionLabel="name"
            optionValue="id"
            placeholder="Select a category"
            className={errors.categoryId ? 'p-invalid w-full' : 'w-full'}
            filter
            filterBy="name"
            emptyMessage="No categories available"
          />
          {errors.categoryId && <small className="p-error">{errors.categoryId}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Transaction Date</label>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            dateFormat="yy-mm-dd"
            maxDate={new Date()}
            className={errors.date ? 'p-invalid w-full' : 'w-full'}
            placeholder="Select transaction date"
            showIcon
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label className="font-semibold">Notes (Optional)</label>
          <InputTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={errors.notes ? 'p-invalid w-full' : 'w-full'}
            placeholder="Add any additional notes..."
            rows={3}
            maxLength={1000}
          />
          {errors.notes && <small className="p-error">{errors.notes}</small>}
        </div>

        {/* Budget Impact Preview - Only for new transactions */}
        {!selectedTransaction && (
          <BudgetImpactPreview
            impactData={budgetImpact}
            loading={budgetImpactLoading}
          />
        )}

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

export default TransactionForm;