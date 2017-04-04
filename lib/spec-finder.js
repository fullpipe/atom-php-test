'use babel';

export class SpecFinder {
  constructor(specDir) {
    this.specsMap = {};
    this.specFiles = [];
    this.specDir = specDir;
  }

  find(className) {
    const self = this;

    if (self.specsMap[className]) {
      return new Promise(function(resolve, reject) {
        resolve(self.specsMap[className]);
      })
    }

    specFiles = [];

    regex = /Spec\.php$/;
    specFinder = function(dir) {
      dir.getEntriesSync().forEach(function(entry) {
        if (entry.isFile() && regex.test(entry.getBaseName())) {
          specFiles.push(entry);
        } else {
          specFinder(entry);
        }
      });
    }

    specFinder(self.specDir);

    namespaceRegex = /\snamespace\sspec\\([^;]+)/;
    classNameRegex = /\sclass\s(\w+)Spec\sextends/;

    let stack = [];

    specFiles.forEach(function(specFile) {
      let namespace, className;

      stack.push(specFile.read().then(function(content) {
        if ((nsMatch = namespaceRegex.exec(content)) !== null) {
          namespace = nsMatch[1];
        }

        if ((classMatch = classNameRegex.exec(content)) !== null) {
          className = classMatch[1];
        }

        if (namespace && className) {
          self.specsMap[namespace + '\\' + className] = specFile
        }
      }));
    });

    return new Promise(function(resolve, reject) {
      Promise.all(stack).then(function() {
        if (self.specsMap[className]) {
          resolve(self.specsMap[className]);
        }

        reject("Spec for " + className + " not found");
      });
    });
  }
};
