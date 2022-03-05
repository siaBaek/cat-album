import Breadcrumb from "./Breadcrumb";
import Nodes from "./Nodes";
import ImageView from "./ImageView";
import { request } from "./api";
import Loading from "./Loading";

export default function App($app) {
  this.state = {
    // isRoot: false,
    isRoot: true,
    nodes: [],
    depth: [],
    selectedFilePath: null,
    isLoading: false,
  };

  const loading = new Loading(this.state.isLoading);

  const imageView = new ImageView({
    $app,
    initialState: this.state.selectedNodeImage,
  });

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth,
  });

  const nodes = new Nodes({
    $app,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    },
    // Nodes 내에선 click 후 어떤 로직이 일어날지 알아야 할 필요가 없음
    onClick: async (node) => {
      try {
        if (node.type === "DIRECTORY") {
          // DIRECTORY
          // 여기서 breadcrumb 처리하면 Nodes에서는 Breadcrumb 몰라도 됨
          const nextNodes = await request(node.id);
          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: nextNodes,
          });
        } else if (node.type === "FILE") {
          // FILE
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
          });
        }
      } catch (e) {
        alert(e.message);
      }
    },
    onBackClick: async () => {
      try {
        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId =
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id;

        if (prevNodeId === null) {
          const rootNodes = await request();
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: rootNodes,
          });
        } else {
          const prevNodes = await request(prevNodeId);

          this.setState({
            ...nextNodes,
            isRoot: false,
            nodes: prevNodes,
          });
        }
      } catch (e) {
        alert(e.message);
      }
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;
    breadcrumb.setState(this.state.depth);
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    imageView.setState(this.state.selectedFilePath);
    loading.setState(this.state.isLoading);
  };

  const init = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true,
      });
      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });
    } catch (e) {
      alert(e.message);
    } finally {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  };
  init();
}
