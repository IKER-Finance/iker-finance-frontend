// Feedback Type Enum (matches backend API)
export const FEEDBACK_TYPE_ENUM = {
  BUG: 1,
  FEATURE: 2,
  IMPROVEMENT: 3,
  QUESTION: 4,
  COMPLAINT: 5,
};

export const FEEDBACK_TYPE_OPTIONS = [
  { label: 'Bug Report', value: FEEDBACK_TYPE_ENUM.BUG },
  { label: 'Feature Request', value: FEEDBACK_TYPE_ENUM.FEATURE },
  { label: 'Improvement', value: FEEDBACK_TYPE_ENUM.IMPROVEMENT },
  { label: 'Question', value: FEEDBACK_TYPE_ENUM.QUESTION },
  { label: 'Complaint', value: FEEDBACK_TYPE_ENUM.COMPLAINT },
];

export const FEEDBACK_TYPE_MAP = {
  [FEEDBACK_TYPE_ENUM.BUG]: 'Bug Report',
  [FEEDBACK_TYPE_ENUM.FEATURE]: 'Feature Request',
  [FEEDBACK_TYPE_ENUM.IMPROVEMENT]: 'Improvement',
  [FEEDBACK_TYPE_ENUM.QUESTION]: 'Question',
  [FEEDBACK_TYPE_ENUM.COMPLAINT]: 'Complaint',
};

// Feedback Priority Enum (matches backend API)
export const FEEDBACK_PRIORITY_ENUM = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export const FEEDBACK_PRIORITY_OPTIONS = [
  { label: 'Low', value: FEEDBACK_PRIORITY_ENUM.LOW },
  { label: 'Medium', value: FEEDBACK_PRIORITY_ENUM.MEDIUM },
  { label: 'High', value: FEEDBACK_PRIORITY_ENUM.HIGH },
  { label: 'Critical', value: FEEDBACK_PRIORITY_ENUM.CRITICAL },
];

export const FEEDBACK_PRIORITY_MAP = {
  [FEEDBACK_PRIORITY_ENUM.LOW]: 'Low',
  [FEEDBACK_PRIORITY_ENUM.MEDIUM]: 'Medium',
  [FEEDBACK_PRIORITY_ENUM.HIGH]: 'High',
  [FEEDBACK_PRIORITY_ENUM.CRITICAL]: 'Critical',
};

// Feedback Status Enum (for reference, returned by API)
export const FEEDBACK_STATUS_ENUM = {
  OPEN: 1,
  IN_PROGRESS: 2,
  RESPONDED: 3,
  RESOLVED: 4,
  CLOSED: 5,
};

export const FEEDBACK_STATUS_MAP = {
  [FEEDBACK_STATUS_ENUM.OPEN]: 'Open',
  [FEEDBACK_STATUS_ENUM.IN_PROGRESS]: 'In Progress',
  [FEEDBACK_STATUS_ENUM.RESPONDED]: 'Responded',
  [FEEDBACK_STATUS_ENUM.RESOLVED]: 'Resolved',
  [FEEDBACK_STATUS_ENUM.CLOSED]: 'Closed',
};
