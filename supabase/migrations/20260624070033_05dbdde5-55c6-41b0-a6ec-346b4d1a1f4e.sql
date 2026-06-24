CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  order_id text UNIQUE NOT NULL,
  utr text UNIQUE NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  customer_name text,
  upi_id text,
  bank_name text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  refund_status text NOT NULL DEFAULT 'not_refunded',
  refund_amount numeric(12,2),
  refund_remark text,
  refund_timestamp timestamptz,
  balance numeric(12,2),
  sms_timestamp timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.transactions TO service_role;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender text,
  message text NOT NULL,
  utr text,
  processing_status text NOT NULL,
  received_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.sms_logs TO service_role;

ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_logs;

CREATE INDEX idx_transactions_created_at ON public.transactions (created_at DESC);
CREATE INDEX idx_transactions_sms_timestamp ON public.transactions (sms_timestamp DESC);
CREATE INDEX idx_transactions_utr ON public.transactions (utr);
CREATE INDEX idx_sms_logs_created_at ON public.sms_logs (created_at DESC);
CREATE INDEX idx_sms_logs_utr ON public.sms_logs (utr);