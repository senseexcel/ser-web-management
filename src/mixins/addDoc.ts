export const exposeAppApi = {
    types: ["GenericObject"],
    init: function init(properties: any) {
        console.log("properties", properties);
      properties.api.app = properties.api.session.getObjectApi({
        handle: 1,
        id: "Doc",
        type: "Doc",
        customType: "Doc",
        delta: true
      });
    }
  };