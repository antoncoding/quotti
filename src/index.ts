import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { getQuote } from './util'
import Webhooks from '@octokit/webhooks';
import { createCheck } from './createCheck'

export = (app: Application) => {
  // Listen for these PR webhook payload types
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request_reopened'], async (context: Context<Webhooks.WebhookPayloadPullRequest>) => {
    const headSha = context.payload.pull_request.head.sha;
    await createCheck(context, headSha);
  });

  // Listen for when a check is manually re-requested (Create a NEW Check & start over)
  app.on('check_run.rerequested', async (context: Context<Webhooks.WebhookPayloadCheckRun>) => {
    const headSha = context.payload.check_run.head_sha
    await createCheck(context, headSha);
  });

  // Listen for when a NEW check is created
  app.on('check_run.created', async(context: Context<Webhooks.WebhookPayloadCheckRun>) => {

    const checkAppId = context.payload.check_run.app.id
    if(checkAppId.toString() !== process.env.APP_ID) return;
    
    const quote = await getQuote()
    const repoOwner = context.payload.repository.owner.login;
    const checkRunId = context.payload.check_run.id;
    const repoName = context.payload.repository.name;

    await context.github.checks.update({
      owner: repoOwner,
      repo: repoName,
      check_run_id: checkRunId,
      status: "completed",
      conclusion: "success",
      output: {
        title: `${quote.text} --${quote.author}`,
        summary: `Quote from ${quote.author} \n ${quote.text}`
      }
    });
    
  });
}
