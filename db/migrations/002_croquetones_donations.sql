CREATE TABLE IF NOT EXISTS croquetones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_number integer NOT NULL UNIQUE,
  title text NOT NULL,
  year text NOT NULL,
  group_photo text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS croqueton_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  croqueton_id uuid NOT NULL REFERENCES croquetones(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT croqueton_members_unique_name UNIQUE (croqueton_id, full_name)
);

CREATE INDEX IF NOT EXISTS croqueton_members_croqueton_idx ON croqueton_members (croqueton_id, display_order);

CREATE TABLE IF NOT EXISTS donation_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  is_its_motul boolean NOT NULL DEFAULT false,
  member_type text CHECK (member_type IN ('student', 'directive', 'general')),
  career text CHECK (career IN ('ISC', 'II', 'IE', 'IER', 'IEM')),
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  donation_year_id uuid REFERENCES donation_years(id) ON DELETE SET NULL,
  croquette_amount numeric(12,3) NOT NULL DEFAULT 0,
  croquette_unit text NOT NULL CHECK (croquette_unit IN ('kg', 'g')),
  croquette_kg numeric(12,3) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT donations_amount_nonnegative CHECK (croquette_amount >= 0),
  CONSTRAINT donations_kg_nonnegative CHECK (croquette_kg >= 0)
);

CREATE TABLE IF NOT EXISTS donation_item_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_es text NOT NULL,
  name_en text NOT NULL
);

CREATE TABLE IF NOT EXISTS donation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  item_type_id uuid REFERENCES donation_item_types(id) ON DELETE SET NULL,
  custom_name text,
  quantity numeric(12,3) NOT NULL CHECK (quantity > 0),
  unit text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donation_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  goal_kg numeric(12,3) NOT NULL DEFAULT 1000,
  is_public boolean NOT NULL DEFAULT true,
  campaign_year integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT donation_goals_positive CHECK (goal_kg > 0)
);

INSERT INTO donation_item_types (slug, name_es, name_en) VALUES
  ('toys', 'Juguetes', 'Toys'),
  ('sachets', 'Sobres de alimento', 'Food sachets'),
  ('accessories', 'Accesorios', 'Accessories'),
  ('beds', 'Camas', 'Beds'),
  ('blankets', 'Cobijas', 'Blankets'),
  ('leashes', 'Correas', 'Leashes'),
  ('bowls', 'Platos para mascotas', 'Pet bowls'),
  ('other', 'Otros', 'Other')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO donation_goals (name, goal_kg, is_public)
SELECT 'Meta principal', 1000, true
WHERE NOT EXISTS (SELECT 1 FROM donation_goals WHERE is_public = true);

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS croquetones_touch_updated_at ON croquetones;
CREATE TRIGGER croquetones_touch_updated_at
  BEFORE UPDATE ON croquetones
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS donors_touch_updated_at ON donors;
CREATE TRIGGER donors_touch_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS donations_touch_updated_at ON donations;
CREATE TRIGGER donations_touch_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS donation_goals_touch_updated_at ON donation_goals;
CREATE TRIGGER donation_goals_touch_updated_at
  BEFORE UPDATE ON donation_goals
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
