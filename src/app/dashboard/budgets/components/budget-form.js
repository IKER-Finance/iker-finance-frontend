import { useEffect, useState, useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { budgetValidationSchema } from '../validation';
import { BUDGET_PERIOD_OPTIONS, BUDGET_PERIOD_MAP, isUnusuallyLargeBudget } from '@/constants/budget-constants';
import { currencyService, categoryService } from '@/services';

const BudgetForm = ({
  isVisible,
  setIsVisible,
  selectedBudget,
  setSelectedBudget,
  onSubmit,
  isLoading,
}) => {
  const [categoryId, setCategoryId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [currencyId, setCurrencyId] = useState(null);
  const [period, setPeriod] = useState(3);
  const [startDate, setStartDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    if (isVisible) {
      fetchCurrencies();
      fetchCategories();
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedBudget) {
      setCategoryId(selectedBudget.categoryId || null);
      setAmount(selectedBudget.amount || null);
      setCurrencyId(selectedBudget.currencyId || null);
      setPeriod(selectedBudget.period ?? 3);
      setStartDate(selectedBudget.startDate ? new Date(selectedBudget.startDate) : new Date());
      setDescription(selectedBudget.description || '');
      setIsActive(selectedBudget.isActive ?? true);
    }
  }, [selectedBudget]);

  const fetchCurrencies = async () => {
    try {
      const response = await currencyService.getActiveCurrencies();
      setCurrencies(response);
    } catch (error) {
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      categoryId,
      amount,
      currencyId,
      period,
      startDate: startDate.toISOString(),
      description: description || null,
      isActive,
    };

    let fieldErrors = {};
    const { error } = budgetValidationSchema.validate(payload, { allowUnknown: true, abortEarly: false });

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

    // Check if amount is unusually large
    if (isUnusuallyLargeBudget(amount, period)) {
      setPendingPayload(payload);
      setShowWarningDialog(true);
      setIsSubmitting(false);
      return;
    }

    // Proceed with submission
    await submitBudget(payload);
  };

  const submitBudget = async (payload) => {
    setIsSubmitting(true);
    try {
      await onSubmit(payload, selectedBudget?.id);
      clearForm();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleConfirmLargeBudget = async () => {
    setShowWarningDialog(false);
    await submitBudget(pendingPayload);
    setPendingPayload(null);
  };

  const handleCancelLargeBudget = () => {
    setShowWarningDialog(false);
    setPendingPayload(null);
  };

  const clearForm = () => {
    setCategoryId(null);
    setAmount(null);
    setCurrencyId(null);
    setPeriod(3);
    setStartDate(new Date());
    setDescription('');
    setIsActive(true);
    setSelectedBudget(null);
    setErrors({});
    setIsVisible(false);
  };

  const handleCancel = () => {
    clearForm();
  };

  const headerText = selectedBudget ? 'Edit Budget' : 'Create Budget';
  const headerIcon = selectedBudget ? 'pi pi-pencil' : 'pi pi-plus-circle';
  const actionButtonLabel = selectedBudget ? 'Update' : 'Create';

  const customHeader = (
    <div className="flex align-items-center gap-3">
      <i className={headerIcon} style={{ fontSize: '1.75rem' }}></i>
      <h2 className="m-0 text-2xl font-bold">{headerText}</h2>
    </div>
  );

  return (
    <>
      <ConfirmDialog
        visible={showWarningDialog}
        onHide={handleCancelLargeBudget}
        message={`You are about to create a ${BUDGET_PERIOD_MAP[period]?.toLowerCase()} budget with an unusually large amount. Are you sure you want to proceed?`}
        header="Unusually Large Budget Amount"
        icon="pi pi-exclamation-triangle"
        accept={handleConfirmLargeBudget}
        reject={handleCancelLargeBudget}
        acceptLabel="Yes, Create Budget"
        rejectLabel="Cancel"
        acceptClassName="p-button-warning"
      />
      <Sidebar
        header={customHeader}
        className="w-full md:w-30rem lg:w-35rem"
        visible={isVisible}
        position="right"
        onHide={handleCancel}
        blockScroll
      >
      <div className="flex flex-column gap-3 pt-3">
        <div className="flex flex-column gap-2">
          <label className="font-semibold">Category</label>
          <Dropdown
            value={categoryId}
            options={categories.filter(c => c.isActive)}
            onChange={(e) => setCategoryId(e.value)}
            optionLabel="name"
            optionValue="id"
            placeholder="Select category"
            className={errors.categoryId ? 'p-invalid w-full' : 'w-full'}
            filter
            disabled={!!selectedBudget}
            appendTo="self"
          />
          {errors.categoryId && <small className="p-error">{errors.categoryId}</small>}
          {selectedBudget && (
            <small className="text-500">Category cannot be changed when editing a budget</small>
          )}
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
    </>
  );
};

export default BudgetForm;