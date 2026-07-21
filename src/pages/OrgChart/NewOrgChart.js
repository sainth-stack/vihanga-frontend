import React from 'react';
import { OrgChart } from 'd3-org-chart';
import Button from "components/Company/Button";

class OrgChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.createDiagram = this.createDiagram.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleCollapseAll = this.handleCollapseAll.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      isMobile: window.innerWidth <= 768,
      isTablet: window.innerWidth > 768 && window.innerWidth <= 1024
    };
  }

  componentDidMount() {
    this.createDiagram();
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.createDiagram();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    if (isMobile !== this.state.isMobile || isTablet !== this.state.isTablet) {
      this.setState({ isMobile, isTablet }, () => {
        this.createDiagram();
      });
    }
  }

  handleExpandAll() {
    if (this.chart) {
      this.chart.expandAll();
    }
  }

  handleCollapseAll() {
    if (this.chart) {
      this.chart.collapseAll();
    }
  }

  handlePrint() {
    // Wait for a short delay to allow the org chart to fully render
    window.setTimeout(() => {
      window.print();
    }, 500); // Adjust the delay time as needed
  }

  render() {
    const { isMobile } = this.state;
    const buttonContainerClass = isMobile ? 
      'd-flex flex-column gap-2 non-printable mb-3' : 
      'd-flex justify-content-end non-printable';

    return (
      <div>
        <div className={buttonContainerClass}>
          <Button
            text="Expand All"
            className="bg-green border text-white"
            onClick={this.handleExpandAll} />
          <Button
            text="Collapse All"
            className="bg-green border text-white"
            onClick={this.handleCollapseAll} />
          <Button
            text="Print"
            className="bg-green border text-white"
            onClick={this.handlePrint}
          />
        </div>
        <div ref={(node) => (this.node = node)} className="org-chart-container" />
      </div>
    );
  }

  createDiagram() {
    const node = this.node;
    console.log(this.props.data,'dasdfdsfta')
    const { isMobile, isTablet } = this.state;
    
    if (!this.props.data) {
      return;
    }
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    
    const containerWidth = node ? node.getBoundingClientRect().width : 800;
    
    // Responsive dimensions
    const nodeWidth = isMobile ? 200 : isTablet ? 220 : 260;
    const nodeHeight = isMobile ? 140 : isTablet ? 160 : 180;
    const childrenMargin = isMobile ? 20 : isTablet ? 30 : 40;
    const compactMarginBetween = isMobile ? 20 : isTablet ? 25 : 35;
    const compactMarginPair = isMobile ? 60 : isTablet ? 80 : 100;
    const initialZoom = isMobile ? 0.5 : isTablet ? 0.6 : 0.7;
    
    // Responsive text and image sizes
    const imageSize = isMobile ? 45 : isTablet ? 50 : 60;
    const nameFontSize = isMobile ? 10 : isTablet ? 11 : 12;
    const positionFontSize = isMobile ? 9 : isTablet ? 10 : 11;
    const subordinatesFontSize = isMobile ? 8 : isTablet ? 9 : 10;
    const padding = isMobile ? 15 : isTablet ? 18 : 20;
    const paddingTop = isMobile ? 20 : isTablet ? 22 : 25;
    
    this.chart
      .container(node)
      .data(this.props.data)
      .nodeId((d) => d.nodeId)
      .parentNodeId((d) => d.parentNodeId)
      .svgWidth(Math.max(containerWidth, isMobile ? 320 : isTablet ? 600 : 800))
      .initialZoom(initialZoom)
      .onNodeClick((d) => console.log(d?.data?.name + ' node clicked'))
      .nodeWidth(() => nodeWidth)
      .nodeHeight(() => nodeHeight)
      .childrenMargin(() => childrenMargin)
      .compactMarginBetween(() => compactMarginBetween)
      .compactMarginPair(() => compactMarginPair)
      .nodeContent((d) => {
        return `
          <div style="padding-top:${isMobile ? 25 : 30}px;background:none;margin-left:1px;height:${d.height}px;border-radius:10px;overflow:visible">
            <div style="height:${d.height - 32}px;padding-top:0;border-radius:10px;background:#837f39">
              <img src="${d.data.nodeImage}" style="margin-top:-${imageSize}px;margin-left:${d.width / 2 - imageSize/2}px;border-radius:100px;width:${imageSize}px;height:${imageSize}px;border:2px solid #837f39;background:#fff;" />
              <div style="padding:${padding}px; padding-top:${paddingTop}px;text-align:center">
                <div style="color:white;font-size:${nameFontSize}px;font-weight:bold;line-height:1.2">${d.data.name || ''}</div>
                <div style="color:white;font-size:${positionFontSize}px;margin-top:4px;opacity:0.9;line-height:1.2">${d.data.positionName || ''}</div>
              </div>
              <div style="text-align:center;color:white;padding-left:${padding}px;padding-right:${padding}px;opacity:0.9;font-size:${subordinatesFontSize}px;line-height:1.2">
                <div>${isMobile ? `${d.data.directSubordinates || 0}D / ${d.data.totalSubordinates || 0}S` : `${d.data.directSubordinates || 0} Direct / ${d.data.totalSubordinates || 0} Subordinates`}</div>
              </div>
            </div>
          </div>
        `;
      })
      .render();
  }
}

export default OrgChartComponent;
