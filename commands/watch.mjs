import chokidar from 'chokidar';

import { debounceTime, defer, Subject, switchMap } from 'rxjs';

import { getOverlayDir, getTargetBuildDir, loadEnvironment, loadProject } from '../lib/project.mjs';
import { Colors, logError, logInfo, logWarn } from '../lib/logger.mjs';
import { runBuildProcess } from '../lib/build-process.mjs';

export async function cmdWatch(env) {
  const project = await loadProject();

  if (project === null) {
    return;
  }

  const targetDir = getTargetBuildDir(project, env);
  const overlayDir = getOverlayDir(env);
  const config = await loadEnvironment(env);

  logInfo(`\n\nWatching changes in ${ Colors.cyan }${ process.cwd() }${ Colors.reset }...\n\n`);

  const watcher = chokidar.watch([ 'src', 'env', 'overlays' ]);
  const pipeline = new Subject();

  const subscription = pipeline
    .pipe(
      debounceTime(250),
      switchMap(() => defer(() => runBuildProcess(env, targetDir, overlayDir, config))))
    .subscribe();

  const onAddHandler = onAdd(pipeline);
  const onChangeHandler = onChange(pipeline);
  const onUnlinkHandler = onUnlink();
  const onErrorHandler = onError(watcher, subscription);

  watcher
    .on('add', onAddHandler)
    .on('change', onChangeHandler)
    .on('unlink', onUnlinkHandler)
    .on('error', onErrorHandler);
}

function onAdd(pipeline) {
  return async file => pipeline.next({ event: 'add', file });
}

function onChange(pipeline) {
  return async file => pipeline.next({ event: 'change', file });
}

function onUnlink() {
  return async file => logWarn(`File ${ Colors.cyan }${ file }${ Colors.reset } was removed, no action will be takes by watcher. Please stop watcher and clean project manually.`);
}

function onError(watcher, subscription) {
  return async error => {
    logError(`Error happened while watching files: ${ error }`);
    subscription.unsubscribe();
    await watcher.close();
  };
}
