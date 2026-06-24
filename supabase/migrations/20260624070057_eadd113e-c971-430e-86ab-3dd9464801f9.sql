CREATE POLICY "Trusted backend can manage transactions"
ON public.transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Trusted backend can manage sms logs"
ON public.sms_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);