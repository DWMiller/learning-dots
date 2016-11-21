import stampit from 'stampit';
import particle from './../particle/particle';

module.exports = stampit()
.compose(particle)
.props({
  type: 'obstacle',
  color: 'rgba(192, 57, 43,1.0)',
});
