// Import any needed model functions
import { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';



const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectID = req.params.id;
    const project = await getProjectDetails(projectID);
    const categories = await getCategoriesByProjectId(projectID);

    const title = 'Service Projects';

    res.render('project', { title, project, categories });
};


const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();

    const title = 'Add New Service Projects';

    res.render('new-project', { title, organizations});
}

const processNewProjectForm = async (req, res) => {
    const (title, description, location, date, organizationid) = req.body;
    
    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully.');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error created new project: ', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}


// Export any controller functions
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };