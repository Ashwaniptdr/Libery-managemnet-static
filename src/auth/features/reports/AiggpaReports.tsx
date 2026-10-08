import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { CENTERS } from 'shared/constants/centers';
import { STATIC_AIGGPA_REPORTS, STATIC_PROJECTS } from 'shared/constants/staticData';

export default function AiggpaReports() {
  const [reports, setReports] = useState<Library.AiggpaReportItem[]>(STATIC_AIGGPA_REPORTS);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields:
  // - Select Center (dropdown)
  // - Advisor (auto-filled from center, editable)
  // - Select Project (dropdown — filtered by selected center)
  // - Year
  // - Number of Copies
  const [centerId, setCenterId] = useState<number | null>(1);
  const [advisor, setAdvisor] = useState(CENTERS[0]?.advisorName ?? '');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [numberOfCopies, setNumberOfCopies] = useState<number | null>(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Projects filtered by selected center
  const centerProjects = STATIC_PROJECTS.filter(p => p.centerId === centerId && p.isActive);

  // Handle center selection — auto-populate advisor, reset project
  const handleCenterChange = (selectedId: number | null) => {
    setCenterId(selectedId);
    setProjectId(null); // reset project when center changes
    if (selectedId) {
      const center = CENTERS.find(c => c.centerId === selectedId);
      if (center?.advisorName) {
        setAdvisor(center.advisorName);
      }
    }
  };

  // Handle project selection — auto-populate advisor from project
  const handleProjectChange = (selectedId: number | null) => {
    setProjectId(selectedId);
    if (selectedId) {
      const project = STATIC_PROJECTS.find(p => p.projectId === selectedId);
      if (project?.advisor) {
        setAdvisor(project.advisor);
      }
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!centerId) errs.centerId = 'Please select a Center';
    if (!advisor.trim()) errs.advisor = 'Advisor name is required';
    if (!projectId) errs.projectId = 'Please select a Project';
    if (!year || year < 1990 || year > 2099) errs.year = 'Enter a valid year';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const center = CENTERS.find(c => c.centerId === centerId);
    const project = STATIC_PROJECTS.find(p => p.projectId === projectId);

    const newReport: Library.AiggpaReportItem = {
      reportId: Date.now(),
      centerId: centerId!,
      centerName: center?.name ?? 'Unknown Center',
      advisor,
      projectId: projectId!,
      projectName: project?.projectName ?? 'Unknown Project',
      year: year!,
      numberOfCopies: numberOfCopies ?? 1,
      availableCopies: numberOfCopies ?? 1,
      isActive: true,
    };

    setReports([newReport, ...reports]);
    setSuccessMessage(`AIGGPA Report for "${project?.projectName}" recorded successfully!`);
    setShowAddForm(false);
    setProjectId(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const columns: Controls.ColumnProps<Library.AiggpaReportItem>[] = [
    { field: 'projectName', header: 'Project / Report Name', width: '35%', sortable: true },
    { field: 'centerName', header: 'Center', width: '28%', sortable: true },
    { field: 'advisor', header: 'Advisor', width: '22%', sortable: true },
    { field: 'year', header: 'Year', width: '15%', sortable: true },
  ];

  return (
    <Page
      header="AIGGPA Center Reports (9 Centers Table Ki Report)"
      subHeader="Catalog institutional projects, policy briefs & research reports across all 9 research centers"
    >
      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success-color)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          <i className="pi pi-check-circle" /> {successMessage}
        </div>
      )}

      {/* Add New Report Section */}
      {showAddForm ? (
        <Card
          title="Add New Center Report"
          onClose={() => setShowAddForm(false)}
        >
          <form onSubmit={handleAddReport}>
            <InputPanel orientation="horizontal">
              {/* Step 1: Select Center */}
              <DropDownList
                name="centerId"
                label="Select Center (9 Centers)"
                data={CENTERS}
                textField="name"
                valueField="centerId"
                value={centerId}
                onChange={handleCenterChange}
                errorMessage={errors.centerId}
                required
              />

              {/* Step 2: Select Project — filtered by center */}
              <DropDownList
                name="projectId"
                label="Select Project"
                data={centerProjects}
                textField="projectName"
                valueField="projectId"
                value={projectId}
                onChange={handleProjectChange}
                errorMessage={errors.projectId}
                required
              />

              {/* Auto-filled Advisor (editable) */}
              <TextBox
                name="advisor"
                label="Advisor"
                value={advisor}
                onChange={val => setAdvisor(val)}
                placeholder="e.g. Dr. R. K. Sharma"
                errorMessage={errors.advisor}
                required
              />

              <NumberBox
                name="year"
                label="Year"
                value={year}
                onChange={val => setYear(val)}
                min={1990}
                max={2099}
                errorMessage={errors.year}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <NumberBox
                name="numberOfCopies"
                label="No. of Copies"
                value={numberOfCopies}
                onChange={val => setNumberOfCopies(val)}
                min={1}
              />
            </InputPanel>

            {/* Helper hint when no center selected yet */}
            {!centerId && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
                <i className="pi pi-info-circle" /> Select a Center first to see available projects.
              </p>
            )}
            {centerId && centerProjects.length === 0 && (
              <p style={{ fontSize: '0.82rem', color: 'var(--secondary-color)', margin: '0 0 1rem 0' }}>
                <i className="pi pi-exclamation-triangle" /> No projects found for this center. Please add a project in Masters → Projects first.
              </p>
            )}

            <ButtonPanel>
              <Button type="submit" variant="primary" icon="check" label="Save Report" />
              <Button
                type="button"
                variant="outlined"
                icon="times"
                label="Cancel"
                onClick={() => setShowAddForm(false)}
              />
            </ButtonPanel>
          </form>
        </Card>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <Button
            variant="primary"
            icon="plus"
            label="+ Add New AIGGPA Report"
            onClick={() => setShowAddForm(true)}
          />
        </div>
      )}

      {/* Reports Data Table */}
      <GridPanel
        title={`AIGGPA Project Reports (${reports.length})`}
        data={reports}
        columns={columns}
        searchFields={['projectName', 'centerName', 'advisor']}
        exportExcel
        onExportExcel={() => alert('Exporting AIGGPA reports to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
