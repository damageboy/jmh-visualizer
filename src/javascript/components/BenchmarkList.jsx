import React, { Component } from 'react';
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import AutoAffix from 'react-overlays/lib/AutoAffix';
import BenchmarkReport from './BenchmarkReport.jsx';
import Waypoint from 'react-waypoint';

function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
        let v = key instanceof Function ? key(x) : x[key];
        let el = rv.find((r) => r && r.key === v);
        if (el) {
            el.values.push(x);
        } else {
            rv.push({
                key: v,
                values: [x]
            });
        }
        return rv;
    }, []);
}

function benchmarkToPackage(item) {
    return item.benchmark.split('.').reverse()[2];
}

function benchmarkToClassName(item) {
    return item.benchmark.split('.').reverse()[1];
}

export default class BenchmarkList extends Component {

    static propTypes = {
        benchmarks: React.PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        const benchmarks = this.props.benchmarks;
        // console.debug(benchmarks.length);

        // const groupByPackage = groupBy(benchmarks, benchmarkToPackage);
        // console.debug(groupByPackage.length);
        // groupByPackage.forEach(function(element) {
        //     console.debug(element)
        // });

        const groupByClassName = groupBy(benchmarks, benchmarkToClassName);
        // console.debug(groupByClassName.length);
        // groupByClassName.forEach(function(element) {
        //     console.debug(element)
        // });

        var selectedBenchmarkClassName;
        console.debug("_-_" + window.location);
        const {hash} = window.location;
        console.debug(hash == '');
        if (hash == null || hash == '') {
            selectedBenchmarkClassName = groupByClassName[0].key
        } else {
            selectedBenchmarkClassName = hash.substring(1)
        }

        this.state = {
            currentBenchmarkClassName: selectedBenchmarkClassName,
            benchmarksGroupedByClassName: groupByClassName
        };
    }


    setCurrentBenchmark(benchmarkClassName) {
        console.debug("setCurrentBenchmark:" + benchmarkClassName);
        // setTimeout(() => {
        this.setState({
            currentBenchmarkClassName: benchmarkClassName
        });
    // });
    }

    renderWaypoint(benchmarkClassName) {
        return (
            <Waypoint
                      onEnter={ ({previousPosition}) => (
                                previousPosition === Waypoint.above && this.setCurrentBenchmark(benchmarkClassName)
                                ) }
                      onLeave={ ({currentPosition}) => (
                                currentPosition === Waypoint.above && this.setCurrentBenchmark(benchmarkClassName)
                                ) }
                      topOffset={ 10 }
                      bottomOffset={ -10 } />
            );
    }

    handleNavItemSelect(key, e) {
        window.location = e.target.href;
        const {hash} = window.location;
    // this.setCurrentBenchmark(hash.substring(0))
    }

    render() {
        console.debug("render");


        return (
            <div>
              <div ref="main" className="container bs-docs-container">
                <div className="row">
                  <p>
                    { this.state.benchmarksGroupedByClassName.length } different Benchmark classes detected!
                  </p>
                  <div className="col-md-10" role="main">
                    { this.state.benchmarksGroupedByClassName.map((element) => <div key={ element.key }>
                                                                                 { this.renderWaypoint(element.key) }
                                                                                 <BenchmarkReport name={ element.key } methodBenchmarks={ element.values } />
                                                                               </div>
                      ) }
                  </div>
                  <div className="col-md-2 bs-docs-sidebar-holder">
                    <AutoAffix viewportOffsetTop={ 15 } container={ this }>
                      <div className="bs-docs-sidebar hidden-print" role="complementary">
                        <Nav className="bs-docs-sidenav" activeHref={ "#" + this.state.currentBenchmarkClassName } onSelect={ this.handleNavItemSelect }>
                          { this.state.benchmarksGroupedByClassName.map((element) => <NavItem href={ "#" + element.key } key={ element.key }>
                                                                                       { element.key }
                                                                                     </NavItem>
                            ) }
                        </Nav>
                      </div>
                    </AutoAffix>
                  </div>
                </div>
              </div>
            </div>
            );
    }
}

