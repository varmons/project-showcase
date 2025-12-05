import { Hero } from "@/components/features/home/hero";
import { FeaturedProjects } from "@/components/features/home/featured-projects";
import { SkillsOverview } from "@/components/features/home/skills-overview";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 900; // refresh every 15 minutes

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured projects from database
  const { data: featuredProjects, error: projectsError } = await supabase
    .from("projects")
    .select(`
      id,
      slug,
      title,
      subtitle,
      content,
      thumbnail_url,
      project_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true });

  if (projectsError) {
    console.error("Error fetching featured projects:", projectsError);
  }

  // Fetch skills from database
  const { data: skillsData, error: skillsError } = await supabase
    .from("skills")
    .select("id, name, category")
    .order("display_order", { ascending: true });

  if (skillsError) {
    console.error("Error fetching skills:", skillsError);
  }

  // Transform projects data to match component interface
  const displayProjects = (featuredProjects || []).map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    content: project.content,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: project.project_tags?.map((pt) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tag = (pt as any).tags || (pt as any).tag;
      return {
        id: tag?.id || '',
        name: tag?.name || '',
      };
    }).filter(Boolean) || [],
  }));

  // Transform skills data to match component interface
  const displaySkills = (skillsData || []).map((skill) => ({
    name: skill.name,
    category: skill.category,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedProjects projects={displayProjects} />
      <SkillsOverview skills={displaySkills} />
    </div>
  );
}
