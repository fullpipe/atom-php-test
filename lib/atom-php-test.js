'use babel';

import {
  CompositeDisposable,
  Directory
} from 'atom';

import { ClassnameGrabber } from './classname-grabber';
import { SpecFinder } from './spec-finder';
import fs from 'fs';

export default {
  subscriptions: null,
  specFilesClasses: null,
  classNameGrabber: null,
  specFinder: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-php-test:go-to-spec': () => this.openSpecFile()
    }));

    this.specFilesClasses = {};
    this.classNameGrabber = new ClassnameGrabber;
    this.specFinder = new SpecFinder(new Directory(atom.project.getPaths() + '/spec'));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.specFilesClasses = null;
    this.classNameGrabber = null;
    this.specFinder = null;
  },

  openSpecFile() {
    const self = this;
    editor = atom.workspace.getActivePaneItem();
    if (editor) {
      currentFile = editor.buffer.file;
    } else {
      return false;
    }

    currentFile.read().then(function(content) {
      let className = self.classNameGrabber.getClassName(content);

      self.specFinder.find(className).then(function(specFile) {
        atom.workspace.open(specFile.getPath());
      }).catch(function(error) {
        return false;
      });
    });
  }
};
