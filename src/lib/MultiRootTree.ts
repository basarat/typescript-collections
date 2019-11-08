
enum Direction {
    BEFORE,
    AFTER,
    INSIDE_AT_END,
    INSIDE_AT_START,
}

export interface FlatTreeNode {
    id: string;
    level: number;
    hasParent: boolean;
    childrenCount: number;
}

export default class MultiRootTree {

    rootIds: Array<string>;
    nodes: { [id: string]: Array<string> };

    constructor(rootIds: Array<string> = [], nodes: { [id: string]: Array<string> } = {}) {
        this.rootIds = rootIds;
        this.nodes = nodes;

        this.initRootIds();
        this.initNodes();
    }

    initRootIds() {
        for (let rootId of this.rootIds) {
            this.createEmptyNodeIfNotExist(rootId);
        }
    }

    initNodes() {
        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                for (let nodeListItem of this.nodes[nodeKey]) {
                    this.createEmptyNodeIfNotExist(nodeListItem);
                }
            }
        }
    }

    createEmptyNodeIfNotExist(nodeKey: string) {
        if (!this.nodes[nodeKey]) {
            this.nodes[nodeKey] = [];
        }
    }


    getRootIds() {
        let clone = this.rootIds.slice();
        return clone;
    }

    getNodes() {
        let clone: { [id: string]: Array<string> } = {};
        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                clone[nodeKey] = this.nodes[nodeKey].slice();
            }
        }

        return clone;
    }

    getObject() {
        return {
            rootIds: this.getRootIds(),
            nodes: this.getNodes(),
        };
    }

    toObject() {
        return this.getObject();
    }

    flatten(): Array<FlatTreeNode> {
        const _this = this;
        let extraPropsObject: Array<FlatTreeNode> = [];

        for (let i = 0; i < this.rootIds.length; i++) {
            const rootId = this.rootIds[i];
            extraPropsObject.push({
                id: rootId,
                level: 0,
                hasParent: false,
                childrenCount: 0,
            });

            traverse(rootId, this.nodes, extraPropsObject, 0);
        }

        for (let o of extraPropsObject) {
            o.childrenCount = countChildren(o.id);
        }

        return extraPropsObject;

        function countChildren(id: string) {
            if (!_this.nodes[id]) {
                return 0;
            } else {
                const childrenCount = _this.nodes[id].length;
                return childrenCount;
            }
        }

        function traverse(startId: string, nodes: { [id: string]: Array<string> }, returnArray: Array<any>, level = 0) {
            if (!startId || !nodes || !returnArray || !nodes[startId]) {
                return;
            }

            level++;

            let idsList = nodes[startId];
            for (let i = 0; i < idsList.length; i++) {
                let id = idsList[i];
                returnArray.push({ id, level, hasParent: true });
                traverse(id, nodes, returnArray, level);
            }

            level--;
        }
    }

    moveIdBeforeId(moveId: string, beforeId: string) {
        return this.moveId(moveId, beforeId, Direction.BEFORE);
    }

    moveIdAfterId(moveId: string, afterId: string) {
        return this.moveId(moveId, afterId, Direction.AFTER);
    }

    moveIdIntoId(moveId: string, insideId: string, atStart = true) {
        if (atStart) {
            return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
        } else {
            return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
        }
    }

    swapRootIdWithRootId(rootId: string, withRootId: string) {
        let leftIndex = this.findRootId(rootId);
        let rightIndex = this.findRootId(withRootId);
        this.swapRootPositionWithRootPosition(leftIndex, rightIndex);
    }

    swapRootPositionWithRootPosition(swapRootPosition: number, withRootPosition: number) {
        let temp = this.rootIds[withRootPosition];
        this.rootIds[withRootPosition] = this.rootIds[swapRootPosition];
        this.rootIds[swapRootPosition] = temp;
    }


    deleteId(id: string) {
        this.rootDeleteId(id);
        this.nodeAndSubNodesDelete(id);
        this.nodeRefrencesDelete(id);
    }

    insertIdBeforeId(beforeId: string, insertId: string) {
        let foundRootIdIndex = this.findRootId(beforeId);
        if (foundRootIdIndex > -1) {
            this.insertIdIntoRoot(insertId, foundRootIdIndex);
        }

        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                let foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                if (foundNodeIdIndex > -1) {
                    this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
                }
            }
        }
    }

    insertIdAfterId(belowId: string, insertId: string) {
        let foundRootIdIndex = this.findRootId(belowId);
        if (foundRootIdIndex > -1) {
            this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
        }

        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                let foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
                if (foundNodeIdIndex > -1) {
                    this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
                }
            }
        }
    }

    insertIdIntoId(insideId: string, insertId: string) {
        this.nodeInsertAtEnd(insideId, insertId);
        this.nodes[insertId] = [];
    }

    insertIdIntoRoot(id: string, position?: number) {
        if (position === undefined) {
            this.rootInsertAtEnd(id);
        } else {
            if (position < 0) {
                const length = this.rootIds.length;
                this.rootIds.splice((position + length + 1), 0, id);
            } else {
                this.rootIds.splice(position, 0, id);
            }
        }

        this.nodes[id] = this.nodes[id] || [];
    }

    insertIdIntoNode(nodeKey: string, id: string, position?: number) {
        this.nodes[nodeKey] = this.nodes[nodeKey] || [];
        this.nodes[id] = this.nodes[id] || [];
        if (position === undefined) {
            this.nodeInsertAtEnd(nodeKey, id);
        } else {
            if (position < 0) {
                const length = this.nodes[nodeKey].length;
                this.nodes[nodeKey].splice((position + length + 1), 0, id);
            } else {
                this.nodes[nodeKey].splice(position, 0, id);
            }
        }
    }

    protected moveId(moveId: string, beforeId: string, direction: Direction) {

        let sourceId = moveId;
        const sourceRootIndex = this.findRootId(sourceId);
        let sourceNodeKey: string;
        let sourceNodeIdIndex: number;

        if (this.nodes[beforeId]) {
            sourceNodeKey = beforeId;
        }

        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                sourceNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                break;
            }
        }

        // got all

        let targetId = beforeId;
        let targetRootIndex = this.findRootId(targetId);
        let targetNodeKey: string;
        let targetNodeIdIndex: number;

        if (this.nodes[beforeId]) {
            targetNodeKey = beforeId;
        }

        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                targetNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                break;
            }
        }

        // got all

        if (sourceRootIndex > -1) {
            if (targetRootIndex > -1) {
                // moving root to root
                // console.log(`Moving ROOT to ROOT`);
                // console.log(`RootIds:`);
                // console.log(this.rootIds);
                // console.log(`TargetIndex=${targetRootIndex}, SourceIndex=${sourceRootIndex}`);
                // console.log(`TargetId=${targetId}, SourceId=${sourceId}`);

                this.rootDelete(sourceRootIndex); // indexes change now

                if (targetRootIndex > sourceRootIndex) {
                    targetRootIndex--;
                } else {

                }

                switch (direction) {
                    case Direction.BEFORE:
                        this.insertIdIntoRoot(sourceId, targetRootIndex);
                        break;
                    case Direction.AFTER:
                        this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
                        break;
                    case Direction.INSIDE_AT_START:
                        this.nodeInsertAtStart(targetId, sourceId);
                        break;
                    case Direction.INSIDE_AT_END:
                        this.nodeInsertAtEnd(targetId, sourceId);
                        break;
                }
            } else {
                // moving root (source) ABOVE node (target)

                // will remove one entry from roots
                this.rootDelete(sourceRootIndex);

                for (let nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        let index = this.findNodeId(nodeKey, targetId);
                        if (index > -1) {
                            switch (direction) {
                                case Direction.BEFORE:
                                    this.insertIdIntoNode(nodeKey, sourceId, index);
                                    break;
                                case Direction.AFTER:
                                    this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                                    break;
                                case Direction.INSIDE_AT_START:
                                    this.nodeInsertAtStart(targetId, sourceId);
                                    break;
                                case Direction.INSIDE_AT_END:
                                    this.nodeInsertAtEnd(targetId, sourceId);
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
        } else {
            if (targetRootIndex > -1) {
                // moving node (source) ABOVE root (target)

                // delete source id from each node
                for (let nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        let index = this.findNodeId(nodeKey, sourceId);
                        if (index > -1) {
                            // this.nodeInsertId(nodeKey, sourceId, index);
                            this.nodeDeleteAtIndex(nodeKey, index);
                            break;
                        }
                    }
                }

                switch (direction) {
                    case Direction.BEFORE:
                        this.insertIdIntoRoot(sourceId, targetRootIndex);
                        break;
                    case Direction.AFTER:
                        this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
                        break;
                    case Direction.INSIDE_AT_START:
                        this.nodeInsertAtStart(targetId, sourceId);
                        break;
                    case Direction.INSIDE_AT_END:
                        this.nodeInsertAtEnd(targetId, sourceId);
                        break;
                }

            } else {
                // moving node (source) ABOVE node (target)

                // delete source id from each node
                for (let nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        let index = this.findNodeId(nodeKey, sourceId);
                        if (index > -1) {
                            this.nodeDeleteAtIndex(nodeKey, index);
                            break;
                        }
                    }
                }

                for (let nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        let index = this.findNodeId(nodeKey, targetId);
                        if (index > -1) {
                            switch (direction) {
                                case Direction.BEFORE:
                                    this.insertIdIntoNode(nodeKey, sourceId, index);
                                    break;
                                case Direction.AFTER:
                                    this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                                    break;
                                case Direction.INSIDE_AT_START:
                                    this.nodeInsertAtStart(targetId, sourceId);
                                    break;
                                case Direction.INSIDE_AT_END:
                                    this.nodeInsertAtEnd(targetId, sourceId);
                                    break;
                            }
                            break;
                        }
                    }
                }

            }
        }
    }

    protected swapArrayElements(arr: Array<any>, indexA: number, indexB: number) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        return arr;
    }

    protected rootDeleteId(id: string) {
        let index = this.findRootId(id);
        if (index > -1) {
            this.rootDelete(index);
        }
    }

    protected nodeAndSubNodesDelete(nodeKey: string) {
        let toDeleteLater: Array<string> = [];
        for (let i = 0; i < this.nodes[nodeKey].length; i++) {
            let id = this.nodes[nodeKey][i];
            this.nodeAndSubNodesDelete(id);
            toDeleteLater.push(nodeKey);
        }

        this.nodeDelete(nodeKey);
        for (let i = 0; i < toDeleteLater.length; i++) {
            this.nodeDelete(toDeleteLater[i]);
        }
    }

    protected nodeRefrencesDelete(id: string) {
        for (let nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                for (let i = 0; i < this.nodes[nodeKey].length; i++) {
                    let targetId = this.nodes[nodeKey][i];
                    if (targetId === id) {
                        this.nodeDeleteAtIndex(nodeKey, i);
                    }
                }
            }
        }
    }

    protected nodeDelete(nodeKey: string) {
        delete this.nodes[nodeKey];
    }


    protected findRootId(id: string): number {
        return this.rootIds.indexOf(id);
    }

    protected findNodeId(nodeKey: string, id: string): number {
        return this.nodes[nodeKey].indexOf(id);
    }

    protected findNode(nodeKey: string) {
        return this.nodes[nodeKey];
    }


    protected nodeInsertAtStart(nodeKey: string, id: string) {
        this.nodes[nodeKey].unshift(id);
    }

    protected nodeInsertAtEnd(nodeKey: string, id: string) {
        this.nodes[nodeKey].push(id);
    }

    protected rootDelete(index: number) {
        this.rootIds.splice(index, 1);
    }

    protected nodeDeleteAtIndex(nodeKey: string, index: number) {
        this.nodes[nodeKey].splice(index, 1);
    }

    protected rootInsertAtStart(id: string) {
        this.rootIds.unshift(id);
    }

    protected rootInsertAtEnd(id: string) {
        this.rootIds.push(id);
    }
}
