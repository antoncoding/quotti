import { Context } from "probot";

export async function createCheck(context: Context, headSha:string) {
  const repoOwner = context.payload.repository.owner.login;
  const repoName = context.payload.repository.name;

  await context.github.checks.create({
    name: 'Quotti',
    owner: repoOwner,
    repo: repoName,
    head_sha: headSha,
    status: "completed",
  });
}