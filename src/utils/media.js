// Shared media helpers

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export const isVideoSlide = (slide) =>
  slide?.mediaType === 'video' || VIDEO_EXT.test(slide?.mediaUrl || '');
