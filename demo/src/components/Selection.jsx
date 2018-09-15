import { React, Component, components, core, ui } from 'avg-core';

const { Layer, Text } = components;
const { Button } = ui;

const style = {
  fontFamily: ['微软雅黑', 'PingFang SC'],
  fontSize: 30,
  lineHeight: 30,
  fill: '#fff',
};

class Textbutton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        src={'buttons/button.png'}
        onClick={this.props.onClick} onTap={this.props.onTap} lite={true}
      >
        <Text text={this.props.text} style={style} x={271} y={49} anchor={this.props.anchor} />
      </Button>
    );
  }
}

export default class Selection extends Component {
  static contextTypes = {
    router: React.PropTypes.any,
  }
  constructor(props) {
    super(props);

    this.handleScriptExec = this.handleScriptExec.bind(this);
    this.handleArchiveSave = this.handleArchiveSave.bind(this);
    this.handleArchiveLoad = this.handleArchiveLoad.bind(this);

    this.state = {
      selections: [],
      enabled: false
    };
  }
  componentDidMount() {
    core.use('script-exec', this.handleScriptExec);
    core.use('save-archive', this.handleArchiveSave);
    core.use('load-archive', this.handleArchiveLoad);
  }
  componentWillUnmount() {
    core.unuse('script-exec', this.handleScriptExec);
    core.unuse('save-archive', this.handleArchiveSave);
    core.unuse('load-archive', this.handleArchiveLoad);
  }
  async handleScriptExec(ctx, next) {
    if (ctx.command === 'selection') {
      this.setState({
        selections: ctx.params.FL,
        enabled: true
      });
    }
    await next();
  }
  async handleArchiveSave(ctx, next) {
    ctx.data.selection = this.state;
    await next();
  }
  async handleArchiveLoad(ctx, next) {
    this.setState(ctx.data.selection);
    await next();
  }
  gotoChapter(name) {
    this.setState({
      selections: [],
      enabled: false
    }, () => this.context.router.push(`/story/${name}`))
  }
  render() {

    const length = this.state.selections.length;
    let selectionPos;

    if (length === 1) {
      selectionPos = [[447, 150]];
    } else if (length === 2) {
      selectionPos = [[447, 150], [683, 150]];
    } else if (length === 3) {
      selectionPos = [[447, 150], [683, 150], [919, 150]];
    }

    return (
      <Layer visible={this.state.enabled}>
        {
          this.state.selections.map((item, i) => {
            return <Textbutton position={[selectionPos[i][0], selectionPos[i][1]]} key={i}
              width={200} height={50}
              onClick={() => this.gotoChapter(item[0])}
              onTap={() => this.gotoChapter(item[0])}
            />;
          })
        }
      </Layer>
    );
  }
}
