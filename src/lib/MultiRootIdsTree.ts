
export enum Direction {
    BEFORE,
    AFTER,
    INSIDE_AT_END,
    INSIDE_AT_START,
}

export default class MultiRootIdsTree {

    rootIds: Array<string>;
    nodes: { [id: string]: Array<string> };

    constructor() {
        // ids must be unique
        this.rootIds = [];
        this.nodes = {};
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

    private moveId(moveId: string, beforeId: string, direction: Direction) {

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
        const targetRootIndex = this.findRootId(targetId);
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
                this.rootDelete(sourceRootIndex);

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

    private swapArrayElements(arr: Array<any>, indexA: number, indexB: number) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        return arr;
    };

    private rootDeleteId(id: string) {
        let index = this.findRootId(id);
        if (index > -1) {
            this.rootDelete(index);
        }
    }

    private nodeAndSubNodesDelete(nodeKey: string) {
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

    private nodeRefrencesDelete(id: string) {
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

    private nodeDelete(nodeKey: string) {
        delete this.nodes[nodeKey];
    }


    private findRootId(id: string): number {
        return this.rootIds.indexOf(id);
    }

    private findNodeId(nodeKey: string, id: string): number {
        return this.nodes[nodeKey].indexOf(id);
    }

    private findNode(nodeKey: string) {
        return this.nodes[nodeKey];
    }


    private nodeInsertAtStart(nodeKey: string, id: string) {
        this.nodes[nodeKey].unshift(id);
    }

    private nodeInsertAtEnd(nodeKey: string, id: string) {
        this.nodes[nodeKey].push(id);
    }

    private rootDelete(index: number) {
        this.rootIds.splice(index, 1);
    }

    private nodeDeleteAtIndex(nodeKey: string, index: number) {
        this.nodes[nodeKey].splice(index, 1);
    }

    private rootInsertAtStart(id: string) {
        this.rootIds.unshift(id);
    }

    private rootInsertAtEnd(id: string) {
        this.rootIds.push(id);
    }
}
