export const updateField = (bodyKey, dbKey) => {
  // if (bodyKey.product) {
  //   updateFieldArray(bodyKey.product, dbKey.product);
  //   updateObject(bodyKey, dbKey);
  // }
  //
  // if (bodyKey.menu) {
  //   updateFieldMenu(bodyKey, dbKey);
  // } else {
  //   updateObject(bodyKey, dbKey);
  // }
  bodyKey.product ? updateFieldArray(bodyKey.product, dbKey.product) : null;
  bodyKey.menu ? updateFieldMenu(bodyKey, dbKey) : updateObject(bodyKey, dbKey);
};

export const updateFieldArray = (body, db) => {
  for (let i = 0; i < db.length; i++) {
    if (!body[i]) {
      body[i] = {};
    }
    for (const key in db[i]) {
      if (body[i]) {
        if (!body[i][key] && key !== "_id") {
          body[i][key] = db[i][key];
        }
      }
      // if (key !== "_id") {
      //   body[i] = {};
      //   body[i][key] = db[i][key];
      // }
    }
  }
};

export const updateFieldMenu = (body, db) => {
  if (Array.isArray(db)) {
    for (const key in db) {
      if (!body.menu[key]) {
        body.menu[key] = db[key];
      }
    }
  } else {
    for (const key in db) {
      if (!body.menu[key]) {
        key !== "options" && key !== "_id" ? (body.menu[key] = db[key]) : false;
      }
    }
  }
};

export const updateObject = (body, db) => {
  for (const key in db) {
    if (!body[key]) {
      body[key] = db[key];
    }
  }
};
