import React from 'react';
import {ArrowBox, Colors} from 'watson-react-components';

const Word = function(props) {

  function click(e) {
    e.preventDefault();
    props.onClick(props);
  }
  return (
    <span className="word arrow-box-container">
      <span onClick={click} className="base--a">{props.alternatives[0].word}</span>
      <ArrowBox direction="top" color={Colors.purple_50}>
        <div style={{
          color: 'white'
        }}>
        </div>
      </ArrowBox>
    </span>
  );
};

Word.propTypes = {
   onClick: React.PropTypes.func.isRequired,
   start_time: React.PropTypes.string.isRequired,
   alternatives: React.PropTypes.array.isRequired
  /*
   * onMouseEnter: React.PropTypes.func.isRequired,
   * onMouseLeave: React.PropTypes.func.isRequired,
   * alternatives: React.PropTypes.array.isRequired,
   * showDetails: React.PropTypes.bool.isRequired,
   * start_time: React.PropTypes.string.isRequired,
   * end_time: React.PropTypes.string.isRequired,
   */
};

export const SearchResults = React.createClass({
  propTypes: {
    messages: React.PropTypes.array.isRequired,
    keywords: React.PropTypes.array.isRequired,
    kwOnClick: React.PropTypes.func
  },

  getInitialState() {
    return {clickSelected: null, mouseSelected: null};
  },
  getSelected() {
    return this.state.clickSelected || this.state.mouseSelected;
  },
  /**
     * Two UI interactions: hover and click
     *
     * If anything gets clicked, it overrides the hover interaction until it is hidden by a second click
     *
     * @param clickSelected
     */
  clickSelect(clickSelected) {
    // second click un-selects
    if (clickSelected === this.state.clickSelected) {
      clickSelected = null;
    }
    this.setState({clickSelected, mouseSelected: null});
  },
  mouseSelect(mouseSelected) {
    if (this.state.clickSelected) {
      return;
    }
    this.setState({mouseSelected});
  },
  render() {
    try {

      const results = this.props.messages.map(msg => {
        return msg.results.filter((res) =>
                 // FIXME
                 // res.final &&
                 res.keywords_result && (Object.keys(res.keywords_result).length > 0)
               ).map((res) => {
                 return (<div>
                   {res.word_alternatives.map((wrdalt) =>
                     Object.keys(res.keywords_result).find((kwname) => res.keywords_result[kwname].find((spot) => 
                      wrdalt.end_time <= spot.end_time && wrdalt.start_time >= spot.start_time
                     ))
                     ? <Word onClick={this.props.kwOnClick || '#'} {...wrdalt}></Word>
                     : <span>{wrdalt.alternatives[0].word} </span>
                  )}
                 </div>);
                 /*
                  * Object.keys(res.keywords_result).map((kw) =>
                  *   res.keywords_result[kw].map((occur, i) =>
                  *     <Word onClick={this.props.kwOnClick || '#'} label={kw} {...occur}></Word>
                  *   )
                  * )
                  */
               });
      }).reduce((a, b) => a.concat(b), []); // the reduce() call flattens the array
      return (
        <div className="word-timings-alternatives">
          {results}
        </div>
      );
    } catch (ex) {
      console.log(ex);
      return (
        <span>{ex.message}</span>
      );
    }
  }
});
