/**
 * Poll Object
 * Holds all data about a single poll.
 *
 * Author: Daniel Lee & Nick Gibson
 *
 * @param none
 */

function Poll() {
  this.active     = false;
  this.results    = {};
  this.voters     = {};
  this.totalVotes = 0;
}

/**
 * Set active according to the passed in value
 *
 * @param Data = {toggle: Boolean}
 * @return {poll_id: String}
 */
Poll.prototype.setActive = function(data) {
  this.active = data.toggle;

  return {poll_id : this.pollID};
}

/**
 * Update the results according to the user's vote
 *
 * @param {voter_id: String, option: String}
 * @return {poll_id: String, voter_id: String, prev_vote: String, cur_vote: String, num_votes: int}
 */
Poll.prototype.vote = function(data) {
  var prevVote = 0;

  //Check whether the person has voted before; if so, decrement the original vote
  if(data.voter_id in this.voters){
  	prevVote = this.voters[data.voter_id];
  	this.results[prevVote] -= 1;

    //Decrement the totalVotes first
    this.totalVotes -= 1;
  }

  //Increment totalVotes
  this.totalVotes += 1;

  //Update the voter's current vote
  this.voters[data.voter_id] = data.option;

  //Update the results
  if(!(data.option in this.results)){
  	this.results[data.option] = 1;
  }
  else {
  	this.results[data.option] += 1;
  }

  return {
    poll_id:   this.pollID,
    voter_id:  data.voter_id,
    prev_vote: prevVote,
    cur_vote:  data.option,
    num_votes: this.totalVotes
  };
}

/**
 * Return the results hashtable
 *
 * @param none
 * @return Hash
 */
Poll.prototype.getResults = function() {
  return this.results;
}

module.exports = Poll;