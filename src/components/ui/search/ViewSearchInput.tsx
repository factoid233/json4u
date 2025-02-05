import { genValueAttrs } from "@/lib/graph/layout";
import { toPath } from "@/lib/idgen";
import { cn } from "@/lib/utils";
import { type SearchResult } from "@/lib/worker/stores/types";
import { useWorker } from "@/stores/editorStore";
import { useStatusStore } from "@/stores/statusStore";
import { getTree } from "@/stores/treeStore";
import SearchInput from "./SearchInput";

export default function ViewSearchInput() {
  const worker = useWorker()!;
  const setRevealPosition = useStatusStore((state) => state.setRevealPosition);

  return (
    <SearchInput
      openListOnFocus
      search={worker.searchInView}
      onSelect={(item) =>
        setRevealPosition({
          type: item.revealType,
          treeNodeId: item.id,
        })
      }
      Item={Item}
      itemHeight={48}
      placeholder={"search_json"}
      bindShortcut="F"
    />
  );
}

function Item(props: SearchResult) {
  const { revealType, id, label } = props;
  const node = getTree().node(id);

  if (!node) {
    return null;
  }

  const pathStr = ["$", ...toPath(id)].join(" > ");
  let className = "";

  if (revealType === "key") {
    className = "text-hl-key";
  } else if (revealType === "value") {
    const { className: cls } = genValueAttrs(node);
    className = cls;
  }

  return (
    <div className="w-full h-12 flex flex-col justify-center">
      <div className={cn("text-sm truncate", className)}>{label}</div>
      <div dir="rtl" className="text-xs text-muted-foreground truncate whitespace-nowrap text-left">
        &lrm;{pathStr}
      </div>
    </div>
  );
}
