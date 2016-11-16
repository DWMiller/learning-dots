import stampit from 'stampit';
import particle from './../particle/particle';
import movement from './../movement';

module.exports = stampit()
.compose(particle, movement)
.props({ type: 'drone' });
