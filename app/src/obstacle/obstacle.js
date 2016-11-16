import stampit from 'stampit';
import particle from './../particle/particle';

module.exports = stampit()
.compose(particle)
.props({
  type: 'obstacle',
  color: '#2A2A2A',
});
