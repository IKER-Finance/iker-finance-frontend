'use client';
import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { feedbackValidationSchema } from '../validation';
import { feedbackService } from '@/services';
import {
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  selectFeedbackSubmitting,
} from '@/redux/feature/feedback-slice';
import {
  FEEDBACK_TYPE_OPTIONS,
  FEEDBACK_PRIORITY_OPTIONS,
  FEEDBACK_PRIORITY_ENUM,
  FEEDBACK_TYPE_ENUM,
} from '@/constants/feedback-constants';
import styles from '../../../OverviewPage.module.css';


const FeedbackForm = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const isSubmitting = useSelector(selectFeedbackSubmitting);

  const [type, setType] = useState(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(FEEDBACK_PRIORITY_ENUM.MEDIUM);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const payload = {
      type,
      subject: subject.trim(),
      description: description.trim(),
      priority,
    };

    let fieldErrors = {};
    const { error } = feedbackValidationSchema.validate(payload, {
      allowUnknown: true,
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((detail) => {
        fieldErrors[detail.context.key] = detail.message;
      });
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors({ ...fieldErrors });
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix the errors in the form.',
        life: 3000,
      });
      return;
    }

    setErrors({});

    try {
      dispatch(submitFeedbackStart());
      const response = await feedbackService.submitFeedback(payload);
      dispatch(submitFeedbackSuccess(response));

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Thank you for your feedback! We have received your submission and will review it shortly.',
        life: 5000,
      });

      // Clear form
      clearForm();
    } catch (error) {
      dispatch(submitFeedbackFailure(error.message));
      toast.current.show({
        severity: 'error',
        summary: 'Submission Failed',
        detail: error.message || 'Failed to submit feedback. Please try again.',
        life: 4000,
      });
    }
  };

  const clearForm = () => {
    setType(null);
    setSubject('');
    setDescription('');
    setPriority(FEEDBACK_PRIORITY_ENUM.MEDIUM);
    setErrors({});
  };

  const handleClear = () => {
    clearForm();
    toast.current.show({
      severity: 'info',
      summary: 'Form Cleared',
      detail: 'All fields have been reset.',
      life: 2000,
    });
  };

  return (
    <div className={styles.pageContainer}>
      <Toast ref={toast} />
      <Card
        title="Submit Feedback"
        subTitle="Help us improve by sharing your thoughts, reporting issues, or requesting features"
        className="shadow-2"
      >
        <div className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="feedback-type" className="font-semibold">
              Feedback Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="feedback-type"
              value={type}
              onChange={(e) => setType(e.value)}
              options={FEEDBACK_TYPE_OPTIONS}
              placeholder="Select feedback type"
              className={errors.type ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.type && <small className="p-error">{errors.type}</small>}
            <small className="text-color-secondary">
              Choose the category that best describes your feedback
            </small>
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="priority" className="font-semibold">
              Priority <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.value)}
              options={FEEDBACK_PRIORITY_OPTIONS}
              placeholder="Select priority level"
              className={errors.priority ? 'p-invalid w-full' : 'w-full'}
            />
            {errors.priority && <small className="p-error">{errors.priority}</small>}
            <small className="text-color-secondary">
              How urgent is this feedback? (Default: Medium)
            </small>
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="subject" className="font-semibold">
              Subject <span className="text-red-500">*</span>
            </label>
            <InputText
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={errors.subject ? 'p-invalid' : ''}
              placeholder="Brief summary of your feedback"
              maxLength={200}
            />
            {errors.subject && <small className="p-error">{errors.subject}</small>}
            <small className="text-color-secondary">
              {subject.length}/200 characters
            </small>
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="description" className="font-semibold">
              Description <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? 'p-invalid w-full' : 'w-full'}
              placeholder="Please provide detailed information about your feedback..."
              rows={8}
              maxLength={2000}
              autoResize
            />
            {errors.description && <small className="p-error">{errors.description}</small>}
            <small className="text-color-secondary">
              {description.length}/2000 characters - Please be as detailed as possible
            </small>
          </div>

          <div className="flex gap-2 justify-content-end mt-3">
            <Button
              label="Clear"
              icon="pi pi-times"
              severity="secondary"
              onClick={handleClear}
              disabled={isSubmitting}
              outlined
            />
            <Button
              label="Submit Feedback"
              icon="pi pi-send"
              onClick={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </div>
      </Card>

      <Card title="What happens next?" className="shadow-2 mt-4">
        <div className="flex flex-column gap-3">
          <div className="flex align-items-start gap-3">
            <i className="pi pi-check-circle text-green-500 text-2xl"></i>
            <div>
              <p className="font-semibold m-0">We review your feedback</p>
              <p className="text-color-secondary m-0 mt-1">
                Our team carefully reviews all submissions to understand your concerns and suggestions.
              </p>
            </div>
          </div>
          <div className="flex align-items-start gap-3">
            <i className="pi pi-users text-blue-500 text-2xl"></i>
            <div>
              <p className="font-semibold m-0">We prioritize and plan</p>
              <p className="text-color-secondary m-0 mt-1">
                Based on priority and impact, we incorporate your feedback into our development roadmap.
              </p>
            </div>
          </div>
          <div className="flex align-items-start gap-3">
            <i className="pi pi-bolt text-orange-500 text-2xl"></i>
            <div>
              <p className="font-semibold m-0">We take action</p>
              <p className="text-color-secondary m-0 mt-1">
                For critical issues, we work on fixes immediately. Feature requests are evaluated for future releases.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackForm;
