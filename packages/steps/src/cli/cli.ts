import path from 'path';

import { createLogger } from '@expo/logger';
import { v4 as uuidv4 } from 'uuid';

import { BuildConfigParser } from '../BuildConfigParser.js';
import { BuildStepContext } from '../BuildStepContext.js';

const logger = createLogger({
  name: 'steps-cli',
  level: 'info',
});

async function runAsync(configPath: string, workingDirectory: string): Promise<void> {
  const fakeBuildId = uuidv4();
  const ctx = new BuildStepContext(fakeBuildId, logger, false, workingDirectory);
  const parser = new BuildConfigParser(ctx, { configPath });
  const workflow = await parser.parseAsync();
  await workflow.executeAsync();
  const artifacts = await workflow.collectArtifactsAsync();
  if (Object.keys(artifacts).length > 0) {
    logger.info({ artifacts }, 'The workflow produced artifacts');
  }
}

const relativeConfigPath = process.argv[2];
const relativeWorkingDirectoryPath = process.argv[3];

if (!relativeConfigPath && !relativeWorkingDirectoryPath) {
  console.error('Usage: yarn cli config.yml path/to/working/directory');
  process.exit(1);
}

const configPath = path.resolve(process.cwd(), relativeConfigPath);
const workingDirectory = path.resolve(process.cwd(), relativeWorkingDirectoryPath);

runAsync(configPath, workingDirectory).catch((err) => {
  logger.error({ err }, 'Build failed');
});
