#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 vUv;

void main () {
  vec2 st = vUv;
  vec3 color = 0.5 + 0.5 * cos(time + st.xyx + vec3(0.0, 2.0, 4.0));
  float circle = smoothstep( 0.01, 0.5, distance(st, vec2(0.5)));
  color -= vec3(circle);
  gl_FragColor = vec4(color, 1.0);
}