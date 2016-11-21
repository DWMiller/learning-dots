import canvasUtil from './canvas_util';
import config from './config';

export default (ctx, objects) => {
  canvasUtil.blurClear(ctx);

  Object.keys(objects).forEach((key) => {
    const obj = objects[key];

    if (Array.isArray(obj)) {
      obj.forEach(x => x.draw(ctx, config));
    } else {
      obj.draw(ctx, config);
    }
  });
};
