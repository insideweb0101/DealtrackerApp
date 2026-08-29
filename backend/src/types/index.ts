export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'sales_rep';
  created_at: Date;
  updated_at: Date;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  value: number;
  status: 'prospecting' | 'qualified' | 'negotiating' | 'won' | 'lost';
  owner_id: string;
  client_name: string;
  expected_close_date: Date;
  probability: number;
  created_at: Date;
  updated_at: Date;
}

export interface Alert {
  id: string;
  deal_id: string;
  type: 'status_change' | 'approaching_deadline' | 'anomaly' | 'stalled' | 'custom';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  alert_id: string;
  user_id: string;
  channel: 'email' | 'slack' | 'sms' | 'in_app';
  content: string;
  sent_at: Date | null;
  delivered_at: Date | null;
  failed_at: Date | null;
  error_message: string | null;
  created_at: Date;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  condition: Record<string, any>;
  actions: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}
