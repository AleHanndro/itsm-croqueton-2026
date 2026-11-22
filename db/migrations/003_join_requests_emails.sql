-- Solicitudes para unirse como colaborador (antes vivían en localStorage).
CREATE TABLE IF NOT EXISTS join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 99),
  email text NOT NULL,
  phone text NOT NULL,
  motivation text NOT NULL,
  has_availability boolean NOT NULL,
  accepts_commitment boolean NOT NULL,
  status text NOT NULL CHECK (status IN ('accepted', 'waitlisted', 'rejected')),
  decided_at timestamptz,
  decided_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT join_requests_email_lowercase CHECK (email = lower(email))
);

-- Una persona no puede estar aceptada o en espera dos veces.
CREATE UNIQUE INDEX IF NOT EXISTS join_requests_active_email_key
  ON join_requests (email)
  WHERE status IN ('accepted', 'waitlisted');
CREATE INDEX IF NOT EXISTS join_requests_status_created_idx ON join_requests (status, created_at);

DROP TRIGGER IF EXISTS join_requests_touch_updated_at ON join_requests;
CREATE TRIGGER join_requests_touch_updated_at
  BEFORE UPDATE ON join_requests
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Donaciones en dinero. money_kg guarda su equivalente en croqueta al momento de registrarla
-- (p. ej. 20 MXN = 1 kg) para que cambiar la tasa después no altere el historial.
ALTER TABLE donations ADD COLUMN IF NOT EXISTS money_amount numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS money_kg numeric(12,3) NOT NULL DEFAULT 0;
ALTER TABLE donations DROP CONSTRAINT IF EXISTS donations_money_nonnegative;
ALTER TABLE donations ADD CONSTRAINT donations_money_nonnegative
  CHECK (money_amount >= 0 AND money_kg >= 0);

-- Bitácora de correos enviados (o fallidos) para poder revisarlos desde el panel.
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('join_accepted', 'join_waitlisted', 'donation_thanks')),
  recipient text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  error text,
  related_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_log_related_idx ON email_log (related_id, created_at DESC);
