import stampit from 'stampit';
import particle from './../particle/particle';

module.exports = stampit()
.compose(particle)
.props({
  type: 'obstacle',
  color: '#d35400',
});
