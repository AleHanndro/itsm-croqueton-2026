/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { Paw } from "@/components/ui";
import { useCommunity } from "@/context/app-context";
import AdminIcon from "@/components/admin-icon";

const emptyDonationDraft = { firstName: "", lastName: "", email: "", belongsToItsm: "yes", role: "alumno", kibbleAmount: "", kibbleUnit: "kg", brands: "", otherItems: "" };
const itsmRoles = [
  { value: "alumno", label: "Alumno" },
  { value: "maestro", label: "Maestro" },
  { value: "directivo", label: "Directivo" },
  { value: "servicios-generales", label: "Servicios generales" }
];
function roleLabel(value) {
  return itsmRoles.find((role) => role.value === value)?.label || "Miembro del ITSM";
}
function formatKibble(donation) {
  return `${donation.kibbleAmount} ${donation.kibbleUnit === "g" ? "g" : "kg"}`;
}
function kibbleKg(donations) {
  return donations.reduce((total, donation) => total + (donation.kibbleUnit === "g" ? Number(donation.kibbleAmount) / 1000 : Number(donation.kibbleAmount)), 0);
}
function AdminDonationsPage() {
  const { donationYears, addDonationYear, addDonation, deleteDonation } = useCommunity();
  const [yearInput, setYearInput] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [donationSearch, setDonationSearch] = useState("");
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [donationDraft, setDonationDraft] = useState(emptyDonationDraft);
  useEffect(() => {
    if (!selectedYear && donationYears.length) setSelectedYear(donationYears[0].year);
  }, [donationYears, selectedYear]);
  const activeYear = selectedYear === "all" ? null : donationYears.find((item) => item.year === selectedYear) || null;
  const normalizedSearch = donationSearch.trim().toLowerCase();
  const matchesSearch = (year, donation) => {
    if (!normalizedSearch) return true;
    return [year, donation.firstName, donation.lastName, donation.email, donation.role, donation.brands, donation.otherItems, formatKibble(donation)].filter(Boolean).join(" ").toLowerCase().includes(normalizedSearch);
  };
  const baseYears = selectedYear === "all" ? donationYears : activeYear ? [activeYear] : [];
  const yearGroups = baseYears.map((item) => {
    const donations = item.donations.filter((donation) => matchesSearch(item.year, donation));
    return { year: item.year, donations };
  }).filter((group) => {
    if (!normalizedSearch) return true;
    return group.donations.length > 0 || (selectedYear !== "all" && group.year === selectedYear);
  });
  const totalDonations = donationYears.reduce((total, item) => total + item.donations.length, 0);
  const totalMatching = yearGroups.reduce((total, group) => total + group.donations.length, 0);
  const createYear = (event) => {
    event.preventDefault();
    const year = yearInput.trim();
    if (addDonationYear(year)) {
      setSelectedYear(year);
      setYearInput("");
      setDonationMessage(`Año ${year} agregado.`);
      return;
    }
    setDonationMessage("Escribe un año de 4 dígitos que no esté registrado.");
  };
  const saveDonation = (event) => {
    event.preventDefault();
    if (!activeYear) return;
    if (!donationDraft.firstName.trim() || !donationDraft.lastName.trim() || !donationDraft.email.trim() || !donationDraft.kibbleAmount) {
      setDonationMessage("Completa nombre, apellido, correo y la cantidad de croquetas.");
      return;
    }
    addDonation(activeYear.year, {
      firstName: donationDraft.firstName.trim(),
      lastName: donationDraft.lastName.trim(),
      email: donationDraft.email.trim(),
      belongsToItsm: donationDraft.belongsToItsm === "yes",
      role: donationDraft.belongsToItsm === "yes" ? donationDraft.role : "",
      kibbleAmount: Number(donationDraft.kibbleAmount),
      kibbleUnit: donationDraft.kibbleUnit,
      brands: donationDraft.brands.trim(),
      otherItems: donationDraft.otherItems.trim()
    });
    setDonationDraft(emptyDonationDraft);
    setShowDonationForm(false);
    setDonationMessage("Donación guardada.");
  };
  const updateDonationDraft = (field, value) => setDonationDraft((current) => ({ ...current, [field]: value }));
  return <section className="admin-main" id="donaciones">
      <div className="admin-welcome">
        <div><span className="eyebrow">Registro de apoyo</span><h1>Donaciones.</h1><p>Agrupa las donaciones por año y registra cada aportación de la manada.</p></div>
        <div className="admin-status"><span /><div><strong>{totalDonations} {totalDonations === 1 ? "donación registrada" : "donaciones registradas"}</strong><small>En {donationYears.length} {donationYears.length === 1 ? "año" : "años"} de registro</small></div></div>
      </div>

      <section className="admin-panel admin-donations">
        <div className="admin-panel-heading">
          <div><span className="chapter">Historial</span><h2>Donaciones por año</h2><p>Filtra por año o busca por nombre, correo, marca o artículo.</p></div>
          <span className="admin-count">{totalDonations}</span>
        </div>

        <div className="admin-donation-toolbar">
          <div className="admin-donations-filter">
            <label className="admin-filter-select">
              <span>Año</span>
              <select value={selectedYear} onChange={(event) => {
    setSelectedYear(event.target.value);
    setShowDonationForm(false);
  }}>
                <option value="all">Todos los años</option>
                {donationYears.map((item) => <option key={item.year} value={item.year}>{item.year} · {item.donations.length} {item.donations.length === 1 ? "donación" : "donaciones"}</option>)}
              </select>
            </label>
            <input type="search" aria-label="Buscar donación" placeholder="Buscar por año, nombre, correo, marca o artículo..." value={donationSearch} onChange={(event) => setDonationSearch(event.target.value)} />
            <span className="admin-filter-count">{totalMatching} de {totalDonations}</span>
          </div>
          <form className="admin-year-form" onSubmit={createYear}>
            <label htmlFor="donation-year">Añadir año</label>
            <div className="admin-year-input-row">
              <input id="donation-year" inputMode="numeric" maxLength={4} placeholder="2026" value={yearInput} onChange={(event) => setYearInput(event.target.value.replace(/\D/g, ""))} />
              <button type="submit">Agregar</button>
            </div>
          </form>
        </div>

        {donationMessage && <p className="admin-donation-message" role="status">{donationMessage}</p>}

        {!donationYears.length ? <div className="admin-empty compact"><AdminIcon type="donation" /><strong>Sin años todavía</strong><p>Agrega un año para comenzar a registrar donaciones.</p></div> : !yearGroups.length ? <div className="admin-empty compact"><AdminIcon type="donation" /><strong>Sin resultados</strong><p>Prueba con otra búsqueda o cambia el año seleccionado.</p></div> : <div className="admin-donation-years">
            {yearGroups.map((group) => {
    const isActiveYear = activeYear?.year === group.year;
    const groupKg = kibbleKg(group.donations);
    return <section className="admin-donation-year" key={group.year}>
                <div className="admin-donation-year-head">
                  <div>
                    <span className="chapter">Año {group.year}</span>
                    <h3>{group.donations.length} {group.donations.length === 1 ? "donación" : "donaciones"}</h3>
                    <p>{groupKg.toLocaleString("es-MX", { maximumFractionDigits: 2 })} kg de croquetas acumulados.</p>
                  </div>
                  {isActiveYear && <button className="admin-add-donation" type="button" onClick={() => {
      setShowDonationForm((current) => !current);
      setDonationMessage("");
    }}>{showDonationForm ? "Cerrar formulario" : "Añadir donación"}</button>}
                </div>

                {isActiveYear && showDonationForm && <form className="admin-donation-form" onSubmit={saveDonation}>
                    <div className="admin-form-grid">
                      <label><span>Nombre</span><input value={donationDraft.firstName} onChange={(event) => updateDonationDraft("firstName", event.target.value)} required /></label>
                      <label><span>Apellido</span><input value={donationDraft.lastName} onChange={(event) => updateDonationDraft("lastName", event.target.value)} required /></label>
                      <label><span>Correo</span><input type="email" value={donationDraft.email} onChange={(event) => updateDonationDraft("email", event.target.value)} required /></label>
                      <label><span>¿Pertenece al ITSM?</span><select value={donationDraft.belongsToItsm} onChange={(event) => updateDonationDraft("belongsToItsm", event.target.value)}><option value="yes">Sí</option><option value="no">No</option></select></label>
                      {donationDraft.belongsToItsm === "yes" && <label><span>¿Qué es?</span><select value={donationDraft.role} onChange={(event) => updateDonationDraft("role", event.target.value)}>{itsmRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></label>}
                      <label><span>Croquetas que dona</span><div className="admin-amount-row"><input type="number" min="0" step="any" value={donationDraft.kibbleAmount} onChange={(event) => updateDonationDraft("kibbleAmount", event.target.value)} placeholder="0" required /><select value={donationDraft.kibbleUnit} onChange={(event) => updateDonationDraft("kibbleUnit", event.target.value)}><option value="kg">Kilos (kg)</option><option value="g">Gramos (g)</option></select></div></label>
                      <label><span>Marca(s)</span><input value={donationDraft.brands} onChange={(event) => updateDonationDraft("brands", event.target.value)} placeholder="Pedigree, Dog Chow..." /></label>
                      <label><span>Otros (sobres, juguetes, etc.)</span><input value={donationDraft.otherItems} onChange={(event) => updateDonationDraft("otherItems", event.target.value)} placeholder="2 sobres, 1 juguete..." /></label>
                    </div>
                    <div className="admin-form-actions">
                      <button className="admin-approve" type="submit">Guardar donación</button>
                      <button type="button" onClick={() => {
        setShowDonationForm(false);
        setDonationDraft(emptyDonationDraft);
      }}>Cancelar</button>
                    </div>
                  </form>}

                {group.donations.length ? <div className="admin-donation-list">
                    {group.donations.map((donation) => <article key={donation.id} className="admin-donation-card">
                        <div className="admin-donation-card-head">
                          <div className="admin-donation-person">
                            <span className="admin-review-avatar"><Paw /></span>
                            <div><strong>{donation.firstName} {donation.lastName}</strong><small>{donation.email}</small></div>
                          </div>
                          <span className={`admin-donation-tag ${donation.belongsToItsm ? "itsm" : "external"}`}>{donation.belongsToItsm ? roleLabel(donation.role) : "Externo"}</span>
                          <button type="button" className="admin-donation-delete" onClick={() => deleteDonation(group.year, donation.id)}>Eliminar</button>
                        </div>
                        <dl className="admin-donation-details">
                          <div><dt>Croquetas</dt><dd>{formatKibble(donation)}</dd></div>
                          {donation.brands && <div><dt>Marca</dt><dd>{donation.brands}</dd></div>}
                          {donation.otherItems && <div><dt>Otros</dt><dd>{donation.otherItems}</dd></div>}
                          <div><dt>Registro</dt><dd>{new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(donation.createdAt))}</dd></div>
                        </dl>
                      </article>)}
                  </div> : <p className="admin-donation-empty">{normalizedSearch ? "Sin resultados para esta búsqueda." : `Aún no hay donaciones registradas en ${group.year}.`}</p>}
              </section>;
  })}
          </div>}
      </section>
    </section>;
}
export default AdminDonationsPage;
