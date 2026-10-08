import React, { useState } from 'react';
import Button from 'shared/components/buttons/Button';
import ButtonPanel from 'shared/components/buttons/ButtonPanel';
import DropDownList from 'shared/components/forms/DropDownList';
import NumberBox from 'shared/components/forms/NumberBox';
import TextArea from 'shared/components/forms/TextArea';
import TextBox from 'shared/components/forms/TextBox';
import Card from 'shared/components/panels/Card';
import GridPanel from 'shared/components/panels/GridPanel';
import InputPanel from 'shared/components/panels/InputPanel';
import Page from 'shared/components/panels/Page';
import { CENTERS } from 'shared/constants/centers';
import { STATIC_PROJECTS } from 'shared/constants/staticData';
import './ProjectList.css';

const STATUS_OPTIONS = [
  { id: 'ONGOING', name: 'Ongoing' },
  { id: 'COMPLETED', name: 'Completed' },
  { id: 'SUSPENDED', name: 'Suspended' },
  { id: 'PROPOSED', name: 'Proposed' },
];

const FILTER_STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Ongoing', value: 'ONGOING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Proposed', value: 'PROPOSED' },
];

const CENTER_FILTER_ALL = { id: 0, name: 'All Centers' };

function statusBadge(status: Library.ProjectStatus) {
  const map: Record<Library.ProjectStatus, { label: string; cls: string }> = {
    ONGOING: { label: '🔄 Ongoing', cls: 'ongoing' },
    COMPLETED: { label: '✅ Completed', cls: 'completed' },
    SUSPENDED: { label: '⏸️ Suspended', cls: 'suspended' },
    PROPOSED: { label: '📋 Proposed', cls: 'proposed' },
  };
  const m = map[status];
  return <span className={`proj-status-badge ${m.cls}`}>{m.label}</span>;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Library.ProjectItem[]>(STATIC_PROJECTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCenterId, setFilterCenterId] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [centerId, setCenterId] = useState<number | null>(null);
  const [advisor, setAdvisor] = useState('');
  const [projectName, setProjectName] = useState('');
  const [startYear, setStartYear] = useState<number | null>(new Date().getFullYear());
  const [endYear, setEndYear] = useState<number | null>(null);
  const [status, setStatus] = useState<Library.ProjectStatus>('ONGOING');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const centerFilterOptions = [
    CENTER_FILTER_ALL,
    ...CENTERS.map(c => ({ id: c.centerId, name: c.name })),
  ];

  const handleCenterChange = (selectedId: number | null) => {
    setCenterId(selectedId);
    if (selectedId) {
      const center = CENTERS.find(c => c.centerId === selectedId);
      if (center?.advisorName) setAdvisor(center.advisorName);
    }
  };

  const filteredProjects = projects.filter(p => {
    const centerMatch = filterCenterId === 0 || p.centerId === filterCenterId;
    const statusMatch = filterStatus === 'ALL' || p.status === filterStatus;
    return centerMatch && statusMatch;
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!centerId) errs.centerId = 'Please select a center';
    if (!advisor.trim()) errs.advisor = 'Advisor name is required';
    if (!projectName.trim()) errs.projectName = 'Project name is required';
    if (!startYear || startYear < 1990 || startYear > 2099) errs.startYear = 'Enter a valid start year';
    if (endYear && endYear < (startYear ?? 1990)) errs.endYear = 'End year must be >= start year';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const center = CENTERS.find(c => c.centerId === centerId);
    const newProject: Library.ProjectItem = {
      projectId: Date.now(),
      projectName,
      centerId: centerId!,
      centerName: center?.name ?? 'Unknown Center',
      advisor,
      startYear: startYear!,
      endYear: endYear ?? null,
      status,
      description: description || undefined,
      isActive: true,
    };

    setProjects([newProject, ...projects]);
    setSuccessMessage(`Project "${projectName}" added successfully!`);
    setShowAddForm(false);
    setProjectName('');
    setAdvisor('');
    setCenterId(null);
    setDescription('');
    setEndYear(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const columns: Controls.ColumnProps<Library.ProjectItem>[] = [
    { field: 'projectName', header: 'Project Name', width: '32%', sortable: true },
    { field: 'centerName', header: 'Center', width: '25%', sortable: true },
    { field: 'advisor', header: 'Advisor', width: '18%', sortable: true },
    {
      field: 'startYear',
      header: 'Year',
      width: '10%',
      sortable: true,
      cell: item => <span>{item.startYear}{item.endYear ? `–${item.endYear}` : ''}</span>,
    },
    {
      field: 'status',
      header: 'Status',
      width: '15%',
      sortable: true,
      cell: item => statusBadge(item.status),
    },
  ];

  return (
    <Page
      header="AIGGPA Project Master"
      subHeader="Manage all research projects across 9 AIGGPA centers. Projects here feed the Project dropdown in AIGGPA Reports."
    >
      {successMessage && (
        <div className="proj-success-banner">
          <i className="pi pi-check-circle" /> {successMessage}
        </div>
      )}

      {showAddForm ? (
        <Card title="Add New Project" onClose={() => setShowAddForm(false)}>
          <form onSubmit={handleAdd}>
            <InputPanel orientation="horizontal">
              <DropDownList
                name="centerId"
                label="Select Center"
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
              <DropDownList
                name="status"
                label="Status"
                data={STATUS_OPTIONS}
                textField="name"
                valueField="id"
                value={status}
                onChange={val => setStatus(val as Library.ProjectStatus)}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <TextBox
                name="projectName"
                label="Project Name"
                value={projectName}
                onChange={val => setProjectName(val)}
                placeholder="e.g. CM Helpline Citizen Satisfaction Audit"
                errorMessage={errors.projectName}
                required
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <NumberBox
                name="startYear"
                label="Start Year"
                value={startYear}
                onChange={val => setStartYear(val)}
                min={1990}
                max={2099}
                errorMessage={errors.startYear}
                required
              />
              <NumberBox
                name="endYear"
                label="End Year (Optional)"
                value={endYear}
                onChange={val => setEndYear(val)}
                min={1990}
                max={2099}
                errorMessage={errors.endYear}
              />
            </InputPanel>

            <InputPanel orientation="horizontal">
              <TextArea
                name="description"
                label="Description (Optional)"
                value={description}
                onChange={val => setDescription(val)}
                placeholder="Brief description of the project objectives..."
              />
            </InputPanel>

            <ButtonPanel>
              <Button type="submit" variant="primary" icon="check" label="Save Project" />
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
        <div className="proj-toolbar">
          <div className="proj-filters">
            <DropDownList
              name="filterCenter"
              label=""
              data={centerFilterOptions}
              textField="name"
              valueField="id"
              value={filterCenterId}
              onChange={val => setFilterCenterId(val as number)}
            />
            <div className="proj-status-filter">
              {FILTER_STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`proj-filter-btn ${filterStatus === opt.value ? 'active' : ''}`}
                  onClick={() => setFilterStatus(opt.value)}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="primary"
            icon="plus"
            label="+ Add New Project"
            onClick={() => setShowAddForm(true)}
          />
        </div>
      )}

      <GridPanel
        title={`Projects (${filteredProjects.length})`}
        data={filteredProjects}
        columns={columns}
        searchFields={['projectName', 'centerName', 'advisor']}
        exportExcel
        onExportExcel={() => alert('Exporting projects to Excel...')}
        print
        onPrint={() => window.print()}
      />
    </Page>
  );
}
