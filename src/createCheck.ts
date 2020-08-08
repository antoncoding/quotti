import { Application, Context } from "probot";

export async function createCheck(app: Application, context: Context, headSha:string) {
  app.log('Recieved a PR webhook payload');
  const repoOwner = context.payload.repository.owner.login;
  const repoName = context.payload.repository.name;

  await context.github.checks.create({
    name: 'Quotti',
    owner: repoOwner,
    repo: repoName,
    head_sha: headSha
  });
}