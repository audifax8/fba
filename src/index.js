const express = require('express');
const uuid = require('uuid');
var http = require('axios');
const app = express();
const port = 3000;

const CUSTOMER_ID = -1, PRODUCT_ID = -1;

let eventsCountByBatch = {};
let errorsByType = {};

//const baseUrl = 'https://development-gcp-us-east4.fluidconfigure.com/metrics';
const baseUrl = 'http://localhost:9707';
//const baseUrl = 'http://localhost:3001';
app.get('/', async (req, res) => {
  const totalCustomers = 1000;
  //const sessionId1 = uuid.v4();
  //const sessionId2 = uuid.v4();
  //const pageView = getEventByType(14, sessionId1);
  // const pageView2 = getEventByType(15, sessionId2);

  //const recipeChange = getEventByType(9, sessionId2);
  //const recipeChange2 = getEventByType(9, sessionId1);
  //await postEvent(baseUrl + '/page_view', pageView);
  //await postEvent(baseUrl + '/page_view', pageView2);

  //await postEvent(baseUrl + '/events', recipeChange);
  //await postEvent(baseUrl + '/events', recipeChange2);

  for (i = 0; i < totalCustomers; i++) {
    const eventsByCustomer = getRandomInt(10);
    const sessionId = uuid.v4();
    for (j = 0; j < eventsByCustomer; j++) {
      const evenType = getRandomInt(14);
      if (evenType === 6) {
        try {
          const pageView = getEventByType(evenType, sessionId);
          eventsCountByBatch["pageView"] = (eventsCountByBatch["pageView"] + 1) || 1;
          //await postEvent(baseUrl + '/page_view', pageView);
        } catch(ex) {
          //console.log(ex.message);
          errorsByType["pageView"] = (errorsByType["pageView"] + 1) || 1;
        }
      } else {
        try {
          const event = getEventByType(evenType, sessionId);
          await postEvent(baseUrl + '/events', event);
          eventsCountByBatch[event.type] = (eventsCountByBatch[event.type] + 1) || 1;
        } catch(ex) {
          errorsByType[event.type] = (errorsByType[event.type] + 1) || 1;
          //console.log(ex.message);
        }
      }
    }
    console.log({
      eventsCountByBatch,
      errorsByType
    });
  }
  res.json({eventsCountByBatch, errorsByType});
});

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const postEvent = async (url, event) => {
  const options = {
    method: 'POST',
      headers: { 'x-api-key': 'Keds-i63NAZMALbbZUjFy' },
      data: { data: event },
      url
  };

  http(options)
    .then(
      result => {
        //console.log({event});
        if (url === 'https://development-gcp-us-east4.fluidconfigure.com/metrics/page_view') {
          //console.log({status: result.status, sessionId: event.session_id})
        }
    }
    )
    .catch(err => {
      const eventWithError = JSON.parse(err.config.data);
      errorsByType[eventWithError.data.type] = (errorsByType[eventWithError.data.type] +1) || 1;
      if (!eventWithError.data.type) {
        errorsByType["pageView"] = (errorsByType["pageView"] +1) || 1;
      } else {
        errorsByType[eventWithError.data.type] = (errorsByType[eventWithError.data.type] +1) || 1;
      }
      console.log({
        eventsCountByBatch,
        errorsByType
      });
    });
};

const PageView = sessionId => (
  {
      api_key: "teoGybfGnEpvuqZtRcUhA68s0P0J_ZWRQQB_UgZa",
      application_name: "configure-core",
      application_version: "3.13.0",
      customer_id: CUSTOMER_ID,
      data_source: "web",
      document_location_url: "http://localhost:8880/demos/desktop/index.html",
      document_referrer: "",
      product_id: PRODUCT_ID,
      screen_height: 1080,
      screen_width: 1920,
      session_id: sessionId,
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
      user_language: "en_us",
      viewport_height: 1001,
      viewport_width: 341,
      workflow: "prod"
  }
);

const PageViewBad = sessionId => (null);

const AddToCart = sessionId => (
  {
    "type":"addToCart",
    "customerId":CUSTOMER_ID,
    "productId":PRODUCT_ID,
    "sessionId":sessionId,
    "imagingStrategy":"imageComposer",
    "quantity":1,
    "price":90,
    "currency":"USD",
    "recipeId":"21517854"
  }
);

const ViewChanged = sessionId => (
  {
    "type":"viewChanged",
    "customerId":CUSTOMER_ID,
    "productId":PRODUCT_ID,
    "sessionId":sessionId,
    "imagingStrategy":"imageComposer",
    "viewName":"Left"
  }
);

const RecipeChanged = sessionId => (
  {
    "type":"recipeChanged",
    "customerId":CUSTOMER_ID,
    "productId":PRODUCT_ID,
    "sessionId":sessionId,
    "imagingStrategy":"imageComposer",
    "attributeName":"Quarter",
    "locale":"en_us",
    "isDefaultLocale":true,
    "attributeId":25558,
    "value":"#ffe928",
    "attributeValueName":"Solid Cyber Yellow",
    "attributeValueId":44111
  }
);

const AttributeViewClicked = sessionId => (
  {
    "type":"attributeViewClicked",
    "customerId":CUSTOMER_ID,
    "productId":PRODUCT_ID,
    "sessionId":sessionId,
    "imagingStrategy":"imageComposer",
    "attributeName":"Quarter",
    "attributeValueName":"Solid Cyber Yellow"
  }
);

const Shared = (type, sessionId) => (
  {
    "type":"sharing",
    "customerId":CUSTOMER_ID,
    "productId":PRODUCT_ID,
    "sessionId":sessionId,
    "imagingStrategy":"imageComposer",
    "platform":type,
    "recipeId":12345678
  }
);

const AddToWishList = sessionId => (
  {
    "type": "addToWishlist",
    "customerId": CUSTOMER_ID,
    "productId": PRODUCT_ID,
    "sessionId": sessionId,
    "imagingStrategy": "imageComposer",
    "recipeId": 12345678
  }
);

const TextureLoaded = sessionId => (
  {
    "customerId": CUSTOMER_ID,
    "duration": 2689,
    "imagingStrategy": "webGL",
    "productId": PRODUCT_ID,
    "sessionId": sessionId,
    "textureUrl": "CFXpro_digital_normal.jpg,CFXpro_digital_basecolor.jpg",
    "type": "textureLoaded"
  }
);

const ModelLoaded = sessionId => (
  {
    "customerId": CUSTOMER_ID,
    "duration": 2691,
    "imagingStrategy": "webGL",
    "productId": PRODUCT_ID,
    "sessionId": sessionId,
    "type": "modelLoaded"
  }
);

const Zoom = sessionId => (
  {
    "action": "zoomIn",
    "customerId": CUSTOMER_ID,
    "distance": 1.351,
    "imagingStrategy": "webGL",
    "productId": PRODUCT_ID,
    "sessionId": sessionId,
    "source": "user",
    "type": "zoom"
  }
);

const Rotation = sessionId => (
  {
    "customerId": CUSTOMER_ID,
    "endPositionX": -64.741,
    "endPositionY": 7.184,
    "endPositionZ": 25.633,
    "imagingStrategy": "webGL",
    "productId": PRODUCT_ID,
    "sessionId": sessionId,
    "source": "user",
    "startPositionX": -70,
    "startPositionY": 0,
    "startPositionZ": 0,
    "type": "rotation"
  }
);

const getEventByType = (eventType, sessionId) => {
  switch (eventType) {
    case eventTypes.PAGE_VIEW:
      return PageView(sessionId);
    case 15:
      return PageViewBad(sessionId);
    case eventTypes.ADD_TO_CART:
      return AddToCart(sessionId);
    case eventTypes.ADD_TO_WISH_LIST:
      return AddToWishList(sessionId);
    case eventTypes.MODEL_LOADED:
      return ModelLoaded(sessionId);
    case eventTypes.ATTRIBUTE_VIEW_CLICKED:
      return AttributeViewClicked(sessionId);
    case eventTypes.VIEW_CHANGED:
      return ViewChanged(sessionId);
    case eventTypes.ROTATION:
      return Rotation(sessionId);
    case eventTypes.TEXTURE_LOADED:
      return TextureLoaded(sessionId);
    case eventTypes.ZOOM:
      return Zoom(sessionId);
    case eventTypes.RECIPE_CHANGED:
      return RecipeChanged(sessionId);
    case eventTypes.SHARING_EMAIL:
      return Shared("email", sessionId);
    case eventTypes.SHARING_FACEBOOK:
      return Shared("facebook", sessionId);
    case eventTypes.SHARING_TWITTER:
      return Shared("twitter", sessionId);
    case eventTypes.SHARING_PINTEREST:
      return Shared("pinterest", sessionId);
    default:
      return Shared("pinterest", sessionId);
  }
};

const eventTypes = {
  ADD_TO_CART: 1,
  ADD_TO_WISH_LIST: 2,
  MODEL_LOADED: 3,
  ATTRIBUTE_VIEW_CLICKED: 4,
  VIEW_CHANGED: 5,
  ROTATION: 14,
  TEXTURE_LOADED: 7,
  ZOOM: 8,
  RECIPE_CHANGED: 9,
  RECIPE_TEXT_CHANGED: 10,
  SHARING_EMAIL: 11,
  SHARING_FACEBOOK: 12,
  SHARING_TWITTER: 13,
  SHARING_PINTEREST: 0,
  PAGE_VIEW: 6
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})