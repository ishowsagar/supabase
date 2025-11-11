-- Policy for reps to only add their own deals
CREATE policy "Reps can only add their own deals"
ON public.sales_deals
FOR insert
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.account_type = 'rep'
  )
);


CREATE policy "Admins to add anyone's deals"
ON public.sales_deals
FOR insert
TO authenticated
WITH CHECK (
  exists (
    select 1 from user_profiles
    where user_profiles.id = auth.uid()
    and user_profiles.account_type = 'admin'
  )
);