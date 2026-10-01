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
import { STATIC_AIGGPA_REPORTS } from 'shared/constants/staticData';

export default function AiggpaReports() {
  const [reports, setReports] = useState<Library.AiggpaReportItem[]>(STATIC_AIGGPA_REPORTS);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields per specification:
  // - Select Center
  // - Advisor
  // - Project Name
  // - Year
  const [centerId, setCenterId] = useState<number | null>(1);
  const [advisor, setAdvisor] = useState(CENTERS[0]?.advisorName ?? '');
  const [projectName, setProjectName] = useState('');
  const [year, setYear] = useState<number | null>(new Date().getFullYear());
  const [numberOfCopies, setNumberOfCopies] = useState<number | null>(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle center selection auto-populating default advisor name
  const handleCenterChange = (selectedId: number | null) => {
    setCenterId(selectedId);
    if (selectedId) {
      const center = CENTERS.find(c => c.centerId === selectedId);
      if (center?.advisorName) {
        setAdvisor(center.advisorName);
      }
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!centerId) errs.centerId = 'Please select a Center';
    if (!advisor.trim()) errs.advisor = 'Advisor name is required';
    if (!projectName.trim()) errs.projectName = 'Project name is required';
    if (!year || year < 1990 || year > 2099) errs.year = 'Enter a valid year';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const center = CENTERS.find(c => c.centerId === centerId);
    const newReport: Library.AiggpaReportItem = {
      reportId: Date.now(),
      centerId: centerId!,
      centerName: center?.name ?? 'Unknown Center',
      advisor,
      projectName,
      year: year!,
      numberOfCopies: numberOfCopies ?? 1,
      availableCopies: numberOfCopies ?? 1,
      isActive: true,
    };

    setReports([newReport, ...reports]);
    setSuccessMessage(`AIGGPA Report for "${projectName}" recorded successfully!`);
    setShowAddForm(false);
    setProjectName('');
  };

  const columns: Controls.ColumnProps<Library.AiggpaReportItem>[] = [
    { field: 'projectName', header: 'Project / Report Name', width: '35%', sortable: true },
    { field: 'centerName', header: 'Center', width: '30%', sortable: true },
    { field: 'advisor', header: 'Advisor', width: '20%', sortable: true },
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

              <TextBox
                name="advisor"
                label="Advisor"
                value={advisor}
                onChange={val => setAdvisor(val)}
                placeholder="e.g. Dr. R. K. Sharma"
                errorMessage={errors.advisor}
                required
              />

              <TextBox
                name="projectName"
                label="Project Name"
                value={projectName}
                onChange={val => setProjectName(val)}
                placeholder="e.g. CM Helpline Citizen Satisfaction Audit"
                errorMessage={errors.projectName}
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
