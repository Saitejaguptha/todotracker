export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'DONE';
    createdAt: string;
}

export const mockTasks: Task[] = [
    { id: '1', title: 'Design system update', description: 'Update color palette and typography', status: 'DONE', createdAt: '2026-03-01T10:00:00Z' },
    { id: '2', title: 'Fix login bug', description: 'User unable to logout on mobile', status: 'PENDING', createdAt: '2026-03-01T11:30:00Z' },
    { id: '3', title: 'Implement search', description: 'Add global search functionality', status: 'PENDING', createdAt: '2026-03-01T14:20:00Z' },
    { id: '4', title: 'Prepare for release', description: 'Final QA and smoke tests', status: 'PENDING', createdAt: '2026-03-02T09:00:00Z' },
    { id: '5', title: 'Client meeting', description: 'Present initial low-fi wireframes', status: 'DONE', createdAt: '2026-03-01T16:45:00Z' },
    { id: '6', title: 'Update documentation', description: 'Complete README and API docs', status: 'PENDING', createdAt: '2026-03-02T10:15:00Z' },
    { id: '7', title: 'Optimise images', description: 'Reduce bundle size by 20%', status: 'DONE', createdAt: '2026-02-28T13:00:00Z' },
    { id: '8', title: 'Add unit tests', description: 'Focus on core utility functions', status: 'PENDING', createdAt: '2026-03-02T11:45:00Z' },
    { id: '9', title: 'Refactor layout', description: 'Switch to CSS Grid for main areas', status: 'DONE', createdAt: '2026-02-27T15:30:00Z' },
    { id: '10', title: 'Analytics setup', description: 'Integrate Google Analytics', status: 'PENDING', createdAt: '2026-03-02T12:00:00Z' },
    { id: '11', title: 'Newsletter draft', description: 'Draft the monthly newsletter', status: 'PENDING', createdAt: '2026-03-02T13:10:00Z' },
    { id: '12', title: 'Dependency audit', description: 'Audit and update npm packages', status: 'DONE', createdAt: '2026-03-01T08:20:00Z' },
    { id: '13', title: 'Performance audit', description: 'Check Core Web Vitals', status: 'PENDING', createdAt: '2026-03-02T14:50:00Z' },
    { id: '14', title: 'Team sync', description: 'Weekly progress report', status: 'DONE', createdAt: '2026-03-02T10:00:00Z' },
    { id: '15', title: 'Security patch', description: 'Address CVE-2024-XXXX', status: 'PENDING', createdAt: '2026-03-02T15:30:00Z' },
    { id: '16', title: 'Browser testing', description: 'Test on Safari and Edge', status: 'PENDING', createdAt: '2026-03-02T16:00:00Z' },
    { id: '17', title: 'Marketing sync', description: 'Discuss social media strategy', status: 'PENDING', createdAt: '2026-03-02T16:30:00Z' },
    { id: '18', title: 'Bug bash', description: 'Community bug hunting session', status: 'PENDING', createdAt: '2026-03-02T17:00:00Z' },
    { id: '19', title: 'Deployment', description: 'Promote staging to production', status: 'PENDING', createdAt: '2026-03-02T18:00:00Z' },
    { id: '20', title: 'Database migration', description: 'Apply v2.4 schema changes', status: 'DONE', createdAt: '2026-03-01T12:00:00Z' },
];
