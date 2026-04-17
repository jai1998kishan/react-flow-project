import { useState, useCallback } from "react";

import "@xyflow/react/dist/style.css";

import axios from "axios";
import {
  applyNodeChanges,
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
} from "@xyflow/react";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

//  Custom Input Node
function InputNode({ data }) {
  return (
    <div className="p-3 bg-white border rounded shadow max-w-md min-w-62.5">
      <div className="text-sm font-semibold mb-2">Input</div>

      <textarea
        className="w-full border p-2 text-sm rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        placeholder="Type your question..."
        value={data.value}
        required
        onChange={(e) => data.onChange(e.target.value)}
      />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

//  Custom Result Node
function ResultNode({ data }) {
  return (
    <div className="p-3 bg-white border rounded shadow w-75 max-w-75">
      <div className="text-sm font-semibold mb-2 ">Result</div>

      <div className="text-sm text-gray-700 whitespace-pre-wrap wrap-break-word max-h-60 overflow-y-auto">
        {data.loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-500">Thinking...</span>
          </div>
        ) : (
          data.value || "Response will appear here..."
        )}
      </div>

      <Handle type="target" position={Position.Left} />
    </div>
  );
}

//  Node Types
const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

export default function FlowApp() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);

  const isInputValid = inputText.trim().length > 0;

  //  Initial Nodes
  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "inputNode",
      position: { x: 0, y: 0 },
      data: {
        value: "",
        onChange: () => {},
      },
    },
    {
      id: "2",
      type: "resultNode",
      position: { x: 450, y: 0 },
      data: {
        value: "",
        loading: false,
      },
    },
  ]);
  //  Edge
  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
    },
  ];

  //  Run Flow
  const runFlow = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ask-ai`,
        {
          prompt: inputText,
        },
      );

      if (res.status === 200) {
        setResult(res.data.result);
      }
    } catch (err) {
      console.error(err);
      setResult("Error fetching response");
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  // save response
  const saveChat = async () => {
    if (!inputText.trim()) {
      toast.error("Prompt is empty");
      return;
    }

    if (!result.trim()) {
      toast.error("No response to save");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/save`, {
        prompt: inputText,
        response: result,
      });

      if (res.status === 200) {
        toast.success("Response saved successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          return {
            ...node,
            data: {
              value: inputText,
              onChange: setInputText,
            },
          };
        }
        if (node.id === "2") {
          return {
            ...node,
            data: {
              value: result,
              loading: loading,
            },
          };
        }
        return node;
      }),
    );
  }, [inputText, result, loading]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* Button */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={runFlow}
          disabled={loading || !isInputValid}
          className={`px-4 py-2 rounded shadow text-white ${
            loading || !isInputValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Running..." : "Run Flow"}
        </button>

        <button
          onClick={saveChat}
          disabled={!isInputValid || !result.trim()}
          className={`px-4 py-2 rounded shadow text-white ${
            !isInputValid || !result.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Save
        </button>
        <ToastContainer />
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
