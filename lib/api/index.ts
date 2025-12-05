/**
 * Data Access Layer
 * Central export for all API functions.
 */

// Server-side functions (use in Server Components)
export {
    getProjects,
    getProjectBySlug,
    getAllProjectSlugs,
    getProjectCategories,
} from "./projects";

export { getExperiences, getExperienceById } from "./experiences";

export { getSkills, getSkillsByCategory } from "./skills";

export { getPosts, getPostBySlug, getAllPostSlugs } from "./posts";

export { getTags, getProjectTags } from "./tags";

// Client-side functions (use in Client Components)
export { createContactMessage } from "./contact";
