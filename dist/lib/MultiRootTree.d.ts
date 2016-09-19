export declare enum Direction {
    BEFORE = 0,
    AFTER = 1,
    INSIDE_AT_END = 2,
    INSIDE_AT_START = 3,
}
export default class MultiRootTree {
    rootIds: Array<string>;
    nodes: {
        [id: string]: Array<string>;
    };
    constructor();
    getRootIds(): string[];
    getNodes(): {
        [id: string]: string[];
    };
    moveIdBeforeId(moveId: string, beforeId: string): void;
    moveIdAfterId(moveId: string, afterId: string): void;
    moveIdIntoId(moveId: string, insideId: string, atStart?: boolean): void;
    deleteId(id: string): void;
    insertIdBeforeId(beforeId: string, insertId: string): void;
    insertIdAfterId(belowId: string, insertId: string): void;
    insertIdIntoId(insideId: string, insertId: string): void;
    insertIdIntoRoot(id: string, position?: number): void;
    insertIdIntoNode(nodeKey: string, id: string, position?: number): void;
    private moveId(moveId, beforeId, direction);
    private swapArrayElements(arr, indexA, indexB);
    private rootDeleteId(id);
    private nodeAndSubNodesDelete(nodeKey);
    private nodeRefrencesDelete(id);
    private nodeDelete(nodeKey);
    private findRootId(id);
    private findNodeId(nodeKey, id);
    private findNode(nodeKey);
    private nodeInsertAtStart(nodeKey, id);
    private nodeInsertAtEnd(nodeKey, id);
    private rootDelete(index);
    private nodeDeleteAtIndex(nodeKey, index);
    private rootInsertAtStart(id);
    private rootInsertAtEnd(id);
}
