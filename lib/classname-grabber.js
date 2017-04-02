'use babel';

export class ClassnameGrabber {
  getClassName(content) {
    if ((nsMatch = /\snamespace\s([^;]+)/.exec(content)) !== null) {
      namespace = nsMatch[1];
    }

    if ((classMatch = /\sclass\s(\w+)\s/.exec(content)) !== null) {
      className = classMatch[1];
    }

    return namespace + '\\' + className;
  }
};
