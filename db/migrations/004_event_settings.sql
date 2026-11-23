-- Datos del evento que aparecen en el correo de aceptación de colaboradores.
-- Una sola fila (id = 1), editable desde /admin/solicitudes. Los campos vacíos
-- usan el valor de las variables EVENT_* del entorno.
CREATE TABLE IF NOT EXISTS event_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  event_date text NOT NULL DEFAULT '',
  event_time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO event_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS event_settings_touch_updated_at ON event_settings;
CREATE TRIGGER event_settings_touch_updated_at
  BEFORE UPDATE ON event_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
