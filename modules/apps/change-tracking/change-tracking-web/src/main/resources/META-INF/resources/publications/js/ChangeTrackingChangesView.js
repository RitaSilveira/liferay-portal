/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayAlert from '@clayui/alert';
import ClayBreadcrumb from '@clayui/breadcrumb';
import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Align, ClayDropDownWithItems} from '@clayui/drop-down';
import {ClayInput, ClayRadio, ClayRadioGroup, ClayToggle} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayManagementToolbar, {
	ClayResultsBar,
} from '@clayui/management-toolbar';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import ClaySticker from '@clayui/sticker';
import ClayTable from '@clayui/table';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import ChangeTrackingComments from './ChangeTrackingComments';
import ChangeTrackingRenderView from './ChangeTrackingRenderView';

export default ({
	activeCTCollection,
	changes,
	contextView,
	ctCollectionId,
	currentUserId,
	dataURL,
	defaultLocale,
	deleteCTCommentURL,
	discardURL,
	expired,
	getCTCommentsURL,
	keywordsFromURL,
	modelData,
	namespace,
	pathFromURL,
	rootDisplayClasses,
	showHideableFromURL,
	siteNames,
	spritemap,
	typeNames,
	updateCTCommentURL,
	userInfo,
}) => {
	const CHANGE_TYPE_ADDITION = 0;
	const CHANGE_TYPE_DELETION = 1;
	const CHANGE_TYPE_MODIFICATION = 2;
	const COLUMN_CHANGE_TYPE = 'CHANGE_TYPE';
	const COLUMN_MODIFIED_DATE = 'MODIFIED_DATE';
	const COLUMN_SITE = 'SITE';
	const COLUMN_TITLE = 'TITLE';
	const COLUMN_USER = 'USER';
	const FILTER_CLASS_EVERYTHING = 'everything';
	const GLOBAL_SITE_NAME = Liferay.Language.get('global');
	const MVC_RENDER_COMMAND_NAME = '/change_tracking/view_changes';
	const PARAM_CT_COLLECTION_ID = namespace + 'ctCollectionId';
	const PARAM_KEYWORDS = namespace + 'keywords';
	const PARAM_MVC_RENDER_COMMAND_NAME = namespace + 'mvcRenderCommandName';
	const PARAM_PATH = namespace + 'path';
	const PARAM_SHOW_HIDEABLE = namespace + 'showHideable';
	const POP_STATE = 'popstate';
	const VIEW_TYPE_CHANGES = 'changes';
	const VIEW_TYPE_CONTEXT = 'context';

	const isWithinApp = useCallback(
		(params) => {
			const ctCollectionIdParam = params.get(PARAM_CT_COLLECTION_ID);
			const mvcRenderCommandName = params.get(
				PARAM_MVC_RENDER_COMMAND_NAME
			);

			if (
				ctCollectionIdParam &&
				ctCollectionIdParam === ctCollectionId.toString() &&
				mvcRenderCommandName &&
				mvcRenderCommandName === MVC_RENDER_COMMAND_NAME
			) {
				return true;
			}

			return false;
		},
		[
			MVC_RENDER_COMMAND_NAME,
			PARAM_CT_COLLECTION_ID,
			PARAM_MVC_RENDER_COMMAND_NAME,
			ctCollectionId,
		]
	);

	const pathname = window.location.pathname;

	const search = window.location.search;

	const params = new URLSearchParams(search);

	const initialized = useRef(false);

	if (
		!initialized.current &&
		isWithinApp(params) &&
		(!window.history.state || !window.history.state.senna)
	) {
		initialized.current = true;

		const state = {
			path: pathname + search,
			senna: true,
		};

		window.history.replaceState(state, document.title);
	}

	params.delete(PARAM_KEYWORDS);
	params.delete(PARAM_PATH);
	params.delete(PARAM_SHOW_HIDEABLE);

	const basePath = useRef(pathname + '?' + params.toString());

	const commentsCache = useRef({});
	const renderCache = useRef({});

	const modelsRef = useRef(null);

	if (modelsRef.current === null) {
		modelsRef.current = JSON.parse(JSON.stringify(modelData));

		const modelKeys = Object.keys(modelsRef.current);

		for (let i = 0; i < modelKeys.length; i++) {
			const model = modelsRef.current[modelKeys[i]];

			if (model.groupId) {
				model.siteName = siteNames[model.groupId.toString()];
			}
			else {
				model.siteName = GLOBAL_SITE_NAME;
			}

			model.typeName = typeNames[model.modelClassNameId.toString()];

			if (model.ctEntryId) {
				model.changeTypeLabel = Liferay.Language.get('modified');

				if (model.changeType === CHANGE_TYPE_ADDITION) {
					model.changeTypeLabel = Liferay.Language.get('added');
				}
				else if (model.changeType === CHANGE_TYPE_DELETION) {
					model.changeTypeLabel = Liferay.Language.get('deleted');
				}

				model.portraitURL =
					userInfo[model.userId.toString()].portraitURL;
				model.userName = userInfo[model.userId.toString()].userName;

				if (model.siteName === GLOBAL_SITE_NAME) {
					let key = Liferay.Language.get('x-modified-a-x-x-ago');

					if (model.changeType === CHANGE_TYPE_ADDITION) {
						key = Liferay.Language.get('x-added-a-x-x-ago');
					}
					else if (model.changeType === CHANGE_TYPE_DELETION) {
						key = Liferay.Language.get('x-deleted-a-x-x-ago');
					}

					model.description = Liferay.Util.sub(
						key,
						model.userName,
						model.typeName,
						model.timeDescription
					);
				}
				else {
					let key = Liferay.Language.get('x-modified-a-x-in-x-x-ago');

					if (model.changeType === CHANGE_TYPE_ADDITION) {
						key = Liferay.Language.get('x-added-a-x-in-x-x-ago');
					}
					else if (model.changeType === CHANGE_TYPE_DELETION) {
						key = Liferay.Language.get('x-deleted-a-x-in-x-x-ago');
					}

					model.description = Liferay.Util.sub(
						key,
						model.userName,
						model.typeName,
						model.siteName,
						model.timeDescription
					);
				}
			}
		}
	}

	const contextViewRef = useRef(null);

	if (contextViewRef.current === null) {
		contextViewRef.current = JSON.parse(JSON.stringify(contextView));

		for (let i = 0; i < rootDisplayClasses.length; i++) {
			const rootClass = contextViewRef.current[rootDisplayClasses[i]];

			let hideable = true;

			for (let j = 0; j < rootClass.children.length; j++) {
				const model =
					modelsRef.current[
						rootClass.children[j].modelKey.toString()
					];

				if (model && !model.hideable) {
					hideable = false;

					break;
				}
			}

			rootClass.hideable = hideable;
		}
	}

	const getPathState = useCallback(
		(param) => {
			if (!param) {
				return {
					filterClass: FILTER_CLASS_EVERYTHING,
					nodeId: 0,
					viewType: VIEW_TYPE_CHANGES,
				};
			}

			const parts = param.split('/');

			const path = [];

			if (parts.length > 2) {
				for (let i = 2; i < parts.length; i++) {
					const part = parts[i];

					const keys = part.split('-');

					path.push({
						modelClassNameId: keys[0],
						modelClassPK: keys[1],
					});
				}
			}

			const pathState = {
				filterClass: parts[1],
				nodeId: 0,
				viewType: parts[0],
			};

			if (
				pathState.filterClass !== FILTER_CLASS_EVERYTHING &&
				!contextViewRef.current[pathState.filterClass]
			) {
				pathState.filterClass = FILTER_CLASS_EVERYTHING;
			}
			else if (
				pathState.viewType === VIEW_TYPE_CHANGES &&
				path.length > 0
			) {
				const modelClassNameId = path[0].modelClassNameId;
				const modelClassPK = path[0].modelClassPK;

				for (let i = 0; i < changes.length; i++) {
					const modelKey = changes[i];

					const model = modelsRef.current[modelKey.toString()];

					if (
						modelClassNameId === model.modelClassNameId &&
						modelClassPK === model.modelClassPK
					) {
						pathState.nodeId = modelKey;
					}
				}
			}
			else if (pathState.viewType === VIEW_TYPE_CONTEXT) {
				let contextNode = contextViewRef.current.everything;

				if (pathState.filterClass !== FILTER_CLASS_EVERYTHING) {
					contextNode = contextViewRef.current[pathState.filterClass];
				}

				for (let i = 0; i < path.length; i++) {
					if (!contextNode.children) {
						break;
					}

					const sessionNode = path[i];

					for (let j = 0; j < contextNode.children.length; j++) {
						const child = contextNode.children[j];

						const model =
							modelsRef.current[child.modelKey.toString()];

						if (
							model.modelClassNameId ===
							sessionNode.modelClassNameId &&
							model.modelClassPK === sessionNode.modelClassPK
						) {
							if (
								pathState.filterClass !==
								FILTER_CLASS_EVERYTHING &&
								i === 0
							) {
								const stack = [
									contextViewRef.current.everything,
								];

								while (stack.length > 0) {
									const element = stack.pop();

									if (element.nodeId === child.nodeId) {
										contextNode = element;

										break;
									}
									else if (!element.children) {
										continue;
									}

									for (
										let i = 0;
										i < element.children.length;
										i++
									) {
										stack.push(element.children[i]);
									}
								}
							}
							else {
								contextNode = child;
							}

							pathState.nodeId = contextNode.nodeId;

							break;
						}
					}
				}
			}

			return pathState;
		},
		[FILTER_CLASS_EVERYTHING, changes]
	);

	const pathState = getPathState(pathFromURL);

	const initialFilterClass = pathState.filterClass;
	const initialNodeId = pathState.nodeId;
	const initialViewType = pathState.viewType;

	const getModels = useCallback((nodes) => {
		if (!nodes) {
			return [];
		}

		const models = [];

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];

			let modelKey = node;
			let nodeId = node;

			if (typeof node === 'object') {
				modelKey = node.modelKey;
				nodeId = node.nodeId;
			}

			if (
				!Object.prototype.hasOwnProperty.call(
					modelsRef.current,
					modelKey.toString()
				)
			) {
				continue;
			}

			const json = JSON.parse(
				JSON.stringify(modelsRef.current[modelKey.toString()])
			);

			json.nodeId = nodeId;

			models.push(json);
		}

		return models;
	}, []);

	const getNode = useCallback(
		(filterClass, nodeId, viewType) => {
			if (viewType === VIEW_TYPE_CHANGES) {
				if (nodeId === 0) {
					return {children: getModels(changes)};
				}

				return JSON.parse(
					JSON.stringify(modelsRef.current[nodeId.toString()])
				);
			}
			else if (
				filterClass !== FILTER_CLASS_EVERYTHING &&
				nodeId === 0
			) {
				return {
					children: getModels(
						contextViewRef.current[filterClass].children
					),
				};
			}

			const rootNode = contextViewRef.current.everything;

			if (nodeId === 0) {
				return {children: getModels(rootNode.children)};
			}

			if (!rootNode.parents) {
				rootNode.parents = [];

				for (let i = 0; i < rootNode.children.length; i++) {
					rootNode.children[i].parents = [];
				}
			}

			const stack = [rootNode];

			while (stack.length > 0) {
				const element = stack.pop();

				if (element.nodeId === nodeId) {
					const entry = JSON.parse(
						JSON.stringify(
							modelsRef.current[element.modelKey.toString()]
						)
					);

					entry.children = getModels(element.children);
					entry.nodeId = nodeId;
					entry.parents = element.parents;

					return entry;
				}
				else if (!element.children) {
					continue;
				}

				for (let i = 0; i < element.children.length; i++) {
					const child = element.children[i];

					if (!child.parents) {
						const parents = element.parents.slice(0);

						const model =
							modelsRef.current[element.modelKey.toString()];

						parents.push({
							hideable: model.hideable,
							modelClassNameId: model.modelClassNameId,
							modelClassPK: model.modelClassPK,
							nodeId: element.nodeId,
							title: model.title,
							typeName: model.typeName,
						});

						child.parents = parents;
					}

					stack.push(child);
				}
			}

			return null;
		},
		[FILTER_CLASS_EVERYTHING, changes, getModels]
	);

	const initialNode = getNode(
		initialFilterClass,
		initialNodeId,
		initialViewType
	);

	const initialShowHideable =
		initialNode.hideable ||
		(initialFilterClass !== FILTER_CLASS_EVERYTHING &&
			contextViewRef.current[initialFilterClass].hideable)
			? true
			: !!showHideableFromURL;

	const [ascendingState, setAscendingState] = useState(true);
	const [columnState, setColumnState] = useState(COLUMN_TITLE);
	const [deltaState, setDeltaState] = useState(20);
	const [resultsKeywords, setResultsKeywords] = useState(keywordsFromURL);
	const [searchTerms, setSearchTerms] = useState(keywordsFromURL);
	const [showComments, setShowComments] = useState(false);
	const [searchMobile, setSearchMobile] = useState(false);

	const filterNodes = (keywords, nodes, showHideable, viewType) => {
		if (!nodes || (!keywords && showHideable)) {
			return nodes;
		}

		const filteredNodes = nodes.slice(0);

		return filteredNodes.filter((node) => {
			if (!showHideable && node.hideable) {
				return false;
			}
			else if (viewType === VIEW_TYPE_CONTEXT || !keywords) {
				return true;
			}

			const pattern = keywords
				.toLowerCase()
				.replace(/[^0-9a-z]+/g, '|')
				.replace(/^\||\|$/g, '');

			if (node.title && node.title.toLowerCase().match(pattern)) {
				return true;
			}

			return false;
		});
	};

	const [renderState, setRenderState] = useState({
		children: filterNodes(
			keywordsFromURL,
			initialNode.children,
			initialShowHideable,
			initialViewType
		),
		filterClass: initialFilterClass,
		id: initialNodeId,
		node: initialNode,
		page: 1,
		showHideable: initialShowHideable,
		viewType: initialViewType,
	});

	const getPath = useCallback(
		(keywords, pathParam, showHideable) => {
			const path =
				basePath.current +
				'&' +
				PARAM_PATH +
				'=' +
				pathParam +
				'&' +
				PARAM_SHOW_HIDEABLE +
				'=' +
				showHideable.toString();

			if (keywords) {
				return path + '&' + PARAM_KEYWORDS + '=' + keywords.toString();
			}

			return path;
		},
		[PARAM_KEYWORDS, PARAM_PATH, PARAM_SHOW_HIDEABLE]
	);

	const getPathParam = (filterClass, node, viewType) => {
		let path = viewType + '/' + filterClass;

		const nodes = [];

		if (viewType !== VIEW_TYPE_CHANGES && node.parents) {
			for (let i = 0; i < node.parents.length; i++) {
				const parent = node.parents[i];

				if (parent.modelClassNameId) {
					nodes.push({
						label: parent.title,
						modelClassNameId: parent.modelClassNameId,
						modelClassPK: parent.modelClassPK,
					});
				}
			}
		}

		if (node.modelClassNameId) {
			nodes.push({
				label: node.title,
				modelClassNameId: node.modelClassNameId,
				modelClassPK: node.modelClassPK,
			});
		}

		if (nodes.length > 0) {
			let tree = '';

			for (let i = 0; i < nodes.length; i++) {
				const node = nodes[i];

				if (node.modelClassNameId) {
					tree +=
						'/' +
						node.modelClassNameId.toString() +
						'-' +
						node.modelClassPK.toString();
				}
			}

			path += tree;
		}

		return path;
	};

	const handleNavigationUpdate = useCallback(
		(json) => {
			let filterClass = json.filterClass;

			if (!filterClass) {
				filterClass = renderState.filterClass;
			}

			const nodeId = json.nodeId;

			let showHideable = renderState.showHideable;

			if (Object.prototype.hasOwnProperty.call(json, 'showHideable')) {
				showHideable = json.showHideable;
			}

			let viewType = json.viewType;

			if (!viewType) {
				viewType = renderState.viewType;
			}

			if (
				viewType === VIEW_TYPE_CONTEXT &&
				contextViewRef.current.errorMessage
			) {
				setRenderState({
					children: renderState.children,
					filterClass: renderState.filterClass,
					id: renderState.id,
					node: renderState.node,
					page: renderState.page,
					showHideable: renderState.showHideable,
					viewType: VIEW_TYPE_CONTEXT,
				});

				return;
			}

			const node = getNode(filterClass, nodeId, viewType);

			const pathParam = getPathParam(filterClass, node, viewType);

			const path = getPath(resultsKeywords, pathParam, showHideable);

			const state = {
				path,
				senna: true,
			};

			window.history.pushState(state, document.title, path);

			setRenderState({
				children: filterNodes(
					resultsKeywords,
					node.children,
					showHideable,
					viewType
				),
				filterClass,
				id: nodeId,
				node,
				page: 1,
				showHideable,
				viewType,
			});

			window.scrollTo(0, 0);
		},
		[VIEW_TYPE_CONTEXT, getNode, getPath, renderState, resultsKeywords]
	);

	const handlePopState = useCallback(
		(event) => {
			const state = event.state;

			let search = window.location.search;

			if (state) {
				const index = state.path.indexOf('?');

				if (index < 0) {
					if (Liferay.SPA && Liferay.SPA.app) {
						Liferay.SPA.app.skipLoadPopstate = false;

						Liferay.SPA.app.navigate(window.location.href, true);
					}

					return;
				}

				search = state.path.substring(index);
			}

			const params = new URLSearchParams(search);

			if (!isWithinApp(params)) {
				if (Liferay.SPA && Liferay.SPA.app) {
					Liferay.SPA.app.skipLoadPopstate = false;

					Liferay.SPA.app.navigate(window.location.href, true);
				}

				return;
			}

			const pathState = getPathState(params.get(PARAM_PATH));

			const filterClass = pathState.filterClass;
			const nodeId = pathState.nodeId;
			const viewType = pathState.viewType;

			if (
				viewType === VIEW_TYPE_CONTEXT &&
				contextViewRef.current.errorMessage
			) {
				setRenderState({
					children: renderState.children,
					filterClass: renderState.filterClass,
					id: renderState.id,
					node: renderState.node,
					page: renderState.page,
					showHideable: renderState.showHideable,
					viewType: VIEW_TYPE_CONTEXT,
				});

				return;
			}

			const node = getNode(filterClass, nodeId, viewType);

			let keywords = params.get(PARAM_KEYWORDS);

			if (!keywords) {
				keywords = '';
			}

			const showHideable =
				node.hideable ||
				(filterClass !== FILTER_CLASS_EVERYTHING &&
					contextViewRef.current[filterClass].hideable)
					? true
					: !!renderState.showHideable;

			setRenderState({
				children: filterNodes(
					keywords,
					node.children,
					showHideable,
					viewType
				),
				filterClass,
				id: nodeId,
				node,
				page: 1,
				showHideable,
				viewType,
			});
			setResultsKeywords(keywords);
			setSearchTerms(keywords);
		},
		[
			PARAM_KEYWORDS,
			PARAM_PATH,
			VIEW_TYPE_CONTEXT,
			getNode,
			getPathState,
			isWithinApp,
			renderState,
		]
	);

	useEffect(() => {
		window.addEventListener(POP_STATE, handlePopState);

		if (Liferay.SPA && Liferay.SPA.app) {
			Liferay.SPA.app.skipLoadPopstate = true;
		}

		return () => {
			window.removeEventListener(POP_STATE, handlePopState);

			if (Liferay.SPA && Liferay.SPA.app) {
				Liferay.SPA.app.skipLoadPopstate = false;
			}
		};
	}, [handlePopState]);

	const filterDisplayNodes = (nodes) => {
		if (getColumn() === COLUMN_CHANGE_TYPE) {
			nodes.sort((a, b) => {
				if (a.changeType < b.changeType) {
					if (ascendingState) {
						return -1;
					}

					return 1;
				}

				if (a.changeType > b.changeType) {
					if (ascendingState) {
						return 1;
					}

					return -1;
				}

				const typeNameA = a.typeName.toLowerCase();
				const typeNameB = b.typeName.toLowerCase();

				if (typeNameA < typeNameB) {
					return -1;
				}

				if (typeNameA > typeNameB) {
					return 1;
				}

				const titleA = a.title.toLowerCase();
				const titleB = b.title.toLowerCase();

				if (titleA < titleB) {
					return -1;
				}

				if (titleA > titleB) {
					return 1;
				}

				return 0;
			});
		}
		else if (getColumn() === COLUMN_SITE) {
			nodes.sort((a, b) => {
				const siteNameA = a.siteName.toLowerCase();
				const siteNameB = b.siteName.toLowerCase();

				if (
					siteNameA < siteNameB ||
					(a.siteName === GLOBAL_SITE_NAME &&
						b.siteName !== GLOBAL_SITE_NAME)
				) {
					if (ascendingState) {
						return -1;
					}

					return 1;
				}

				if (
					siteNameA > siteNameB ||
					(a.siteName !== GLOBAL_SITE_NAME &&
						b.siteName === GLOBAL_SITE_NAME)
				) {
					if (ascendingState) {
						return 1;
					}

					return -1;
				}

				const typeNameA = a.typeName.toLowerCase();
				const typeNameB = b.typeName.toLowerCase();

				if (typeNameA < typeNameB) {
					return -1;
				}

				if (typeNameA > typeNameB) {
					return 1;
				}

				const titleA = a.title.toLowerCase();
				const titleB = b.title.toLowerCase();

				if (titleA < titleB) {
					return -1;
				}

				if (titleA > titleB) {
					return 1;
				}

				return 0;
			});
		}
		else if (getColumn() === COLUMN_TITLE) {
			nodes.sort((a, b) => {
				const typeNameA = a.typeName.toLowerCase();
				const typeNameB = b.typeName.toLowerCase();

				if (typeNameA < typeNameB) {
					return -1;
				}

				if (typeNameA > typeNameB) {
					return 1;
				}

				const titleA = a.title.toLowerCase();
				const titleB = b.title.toLowerCase();

				if (titleA < titleB) {
					if (ascendingState) {
						return -1;
					}

					return 1;
				}

				if (titleA > titleB) {
					if (ascendingState) {
						return 1;
					}

					return -1;
				}

				return 0;
			});
		}
		else if (getColumn() === COLUMN_USER) {
			nodes.sort((a, b) => {
				const userNameA = a.userName.toLowerCase();
				const userNameB = b.userName.toLowerCase();

				if (userNameA < userNameB) {
					if (ascendingState) {
						return -1;
					}

					return 1;
				}

				if (userNameA > userNameB) {
					if (ascendingState) {
						return 1;
					}

					return -1;
				}

				const typeNameA = a.typeName.toLowerCase();
				const typeNameB = b.typeName.toLowerCase();

				if (typeNameA < typeNameB) {
					return -1;
				}

				if (typeNameA > typeNameB) {
					return 1;
				}

				const titleA = a.title.toLowerCase();
				const titleB = b.title.toLowerCase();

				if (titleA < titleB) {
					return -1;
				}

				if (titleA > titleB) {
					return 1;
				}

				return 0;
			});
		}
		else {
			nodes.sort((a, b) => {
				if (a.modifiedTime < b.modifiedTime) {
					if (ascendingState) {
						return -1;
					}

					return 1;
				}

				if (a.modifiedTime > b.modifiedTime) {
					if (ascendingState) {
						return 1;
					}

					return -1;
				}

				return 0;
			});
		}

		if (nodes.length > 5) {
			return nodes.slice(
				deltaState * (renderState.page - 1),
				deltaState * renderState.page
			);
		}

		return nodes;
	};

	const getBreadcrumbItems = (filterClass, node, nodeId, viewType) => {
		if (viewType === VIEW_TYPE_CHANGES) {
			if (nodeId === 0) {
				return [
					{
						active: true,
						label: Liferay.Language.get('home'),
					},
				];
			}

			return [
				{
					label: Liferay.Language.get('home'),
					onClick: () =>
						handleNavigationUpdate({
							nodeId: 0,
						}),
				},
				{
					active: true,
					label: node.title,
					modelClassNameId: node.modelClassNameId,
					modelClassPK: node.modelClassPK,
				},
			];
		}

		const breadcrumbItems = [];
		const homeBreadcrumbItem = {label: Liferay.Language.get('home')};

		if (filterClass === FILTER_CLASS_EVERYTHING && nodeId === 0) {
			homeBreadcrumbItem.active = true;

			breadcrumbItems.push(homeBreadcrumbItem);

			return breadcrumbItems;
		}

		homeBreadcrumbItem.onClick = () =>
			handleNavigationUpdate({
				filterClass: FILTER_CLASS_EVERYTHING,
				nodeId: 0,
			});

		breadcrumbItems.push(homeBreadcrumbItem);

		let showParent = false;

		if (filterClass === FILTER_CLASS_EVERYTHING) {
			showParent = true;
		}
		else {
			let label = filterClass;

			if (label.includes('.')) {
				label = label.substring(
					label.lastIndexOf('.') + 1,
					label.length
				);
			}

			const rootDisplayClassBreadcrumb = {label};

			if (nodeId === 0) {
				rootDisplayClassBreadcrumb.active = true;

				breadcrumbItems.push(rootDisplayClassBreadcrumb);

				return breadcrumbItems;
			}

			rootDisplayClassBreadcrumb.onClick = () =>
				handleNavigationUpdate({
					filterClass: renderState.filterClass,
					nodeId: 0,
				});

			breadcrumbItems.push(rootDisplayClassBreadcrumb);
		}

		if (!node.parents) {
			return null;
		}

		for (let i = 0; i < node.parents.length; i++) {
			const parent = node.parents[i];

			if (parent.typeName === filterClass) {
				showParent = true;
			}

			if (!showParent) {
				continue;
			}

			breadcrumbItems.push({
				hideable: parent.hideable,
				label: parent.title,
				modelClassNameId: parent.modelClassNameId,
				modelClassPK: parent.modelClassPK,
				nodeId: parent.nodeId,
				onClick: () =>
					handleNavigationUpdate({
						filterClass: renderState.filterClass,
						nodeId: parent.nodeId,
					}),
			});
		}

		breadcrumbItems.push({
			active: true,
			label: node.title,
			modelClassNameId: node.modelClassNameId,
			modelClassPK: node.modelClassPK,
		});

		return breadcrumbItems;
	};

	const getColumn = () => {
		if (renderState.viewType === VIEW_TYPE_CONTEXT) {
			return COLUMN_TITLE;
		}

		return columnState;
	};

	const getColumnHeader = (column, title) => {
		let orderListIcon = 'order-list-up';

		if (ascendingState) {
			orderListIcon = 'order-list-down';
		}

		return (
			<ClayButton
				className={columnState === column ? '' : 'text-secondary'}
				displayType="unstyled"
				onClick={() => {
					if (columnState === column) {
						setAscendingState(!ascendingState);

						return;
					}

					setColumnState(column);
				}}
			>
				{title}

				<span
					className={`inline-item inline-item-after ${
						columnState === column ? '' : 'text-muted'
					}`}
				>
					<ClayIcon
						spritemap={spritemap}
						symbol={
							columnState === column
								? orderListIcon
								: 'order-arrow'
						}
					/>
				</span>
			</ClayButton>
		);
	};

	const setParameter = useCallback(
		(url, name, value) => {
			return url + '&' + namespace + name + '=' + value;
		},
		[namespace]
	);

	const getDataURL = (node) => {
		if (node.ctEntryId) {
			const url = setParameter(
				dataURL,
				'activeCTCollection',
				activeCTCollection.toString()
			);

			return setParameter(url, 'ctEntryId', node.ctEntryId.toString());
		}

		const url = setParameter(
			dataURL,
			'modelClassNameId',
			node.modelClassNameId.toString()
		);

		return setParameter(url, 'modelClassPK', node.modelClassPK.toString());
	};

	const getDiscardURL = useCallback(
		(node) => {
			const url = setParameter(
				discardURL,
				'modelClassNameId',
				node.modelClassNameId.toString()
			);

			return setParameter(
				url,
				'modelClassPK',
				node.modelClassPK.toString()
			);
		},
		[discardURL, setParameter]
	);

	const getTableRows = (nodes) => {
		const rows = [];

		if (!nodes) {
			return rows;
		}

		let currentTypeName = '';

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];

			if (node.typeName !== currentTypeName) {
				currentTypeName = node.typeName;

				rows.push(
					<ClayTable.Row divider>
						<ClayTable.Cell
							colSpan={
								renderState.viewType === VIEW_TYPE_CHANGES
									? 5
									: 1
							}
						>
							{node.typeName}
						</ClayTable.Cell>
					</ClayTable.Row>
				);
			}

			const cells = [];

			if (renderState.viewType === VIEW_TYPE_CONTEXT) {
				cells.push(
					<ClayTable.Cell>
						<div className="publication-name">{node.title}</div>

						{node.description && (
							<div className="publication-description">
								{node.description}
							</div>
						)}
					</ClayTable.Cell>
				);
			}
			else {
				cells.push(
					<ClayTable.Cell>
						<ClaySticker
							className={`sticker-user-icon ${
								node.portraitURL
									? ''
									: 'user-icon-color-' + (node.userId % 10)
							}`}
							data-tooltip-align="top"
							title={node.userName}
						>
							{node.portraitURL ? (
								<div className="sticker-overlay">
									<img
										className="sticker-img"
										src={node.portraitURL}
									/>
								</div>
							) : (
								<ClayIcon symbol="user" />
							)}
						</ClaySticker>
					</ClayTable.Cell>
				);

				cells.push(<ClayTable.Cell>{node.siteName}</ClayTable.Cell>);

				cells.push(
					<ClayTable.Cell className="publication-name table-cell-expand">
						{node.title}
					</ClayTable.Cell>
				);

				cells.push(
					<ClayTable.Cell className="table-cell-expand-smallest">
						{node.changeTypeLabel}
					</ClayTable.Cell>
				);

				cells.push(
					<ClayTable.Cell className="table-cell-expand-smallest">
						{Liferay.Util.sub(
							Liferay.Language.get('x-ago'),
							node.timeDescription
						)}
					</ClayTable.Cell>
				);
			}

			rows.push(
				<ClayTable.Row
					className="cursor-pointer"
					onClick={() =>
						handleNavigationUpdate({
							nodeId: node.nodeId,
						})
					}
				>
					{cells}
				</ClayTable.Row>
			);
		}

		return rows;
	};

	const handleFiltersUpdate = (keywords) => {
		setResultsKeywords(keywords);

		const pathParam = getPathParam(
			renderState.filterClass,
			renderState.node,
			renderState.viewType
		);

		const path = getPath(keywords, pathParam, renderState.showHideable);

		const state = {
			path,
			senna: true,
		};

		window.history.pushState(state, document.title, path);

		setRenderState({
			children: filterNodes(
				keywords,
				renderState.node.children,
				renderState.showHideable,
				renderState.viewType
			),
			filterClass: renderState.filterClass,
			id: renderState.id,
			node: renderState.node,
			page: renderState.page,
			showHideable: renderState.showHideable,
			viewType: renderState.viewType,
		});
		setResultsKeywords(keywords);

		window.scrollTo(0, 0);
	};

	const handleShowHideableToggle = (showHideable) => {
		const breadcrumbItems = getBreadcrumbItems(
			renderState.filterClass,
			renderState.node,
			renderState.id,
			renderState.viewType
		);

		if (!showHideable) {
			if (
				renderState.viewType === VIEW_TYPE_CONTEXT &&
				contextViewRef.current[renderState.filterClass].hideable
			) {
				handleNavigationUpdate({
					filterClass: FILTER_CLASS_EVERYTHING,
					nodeId: 0,
					showHideable,
				});

				return;
			}
			else if (renderState.node.hideable) {
				let nodeId = 0;

				for (let i = breadcrumbItems.length - 2; i > 0; i--) {
					const breadcrumbItem = breadcrumbItems[i];

					if (!breadcrumbItem.hideable) {
						if (breadcrumbItem.nodeId) {
							nodeId = breadcrumbItem.nodeId;
						}

						break;
					}
				}

				handleNavigationUpdate({
					nodeId,
					showHideable,
				});

				return;
			}
		}

		const oldState = window.history.state;

		const pathParam = getPathParam(
			renderState.filterClass,
			renderState.node,
			renderState.viewType
		);

		const params = new URLSearchParams(window.location.search);

		const oldPathParam = params.get(PARAM_PATH);

		if (
			isWithinApp(params) &&
			(!oldPathParam || oldPathParam === pathParam)
		) {
			const path = getPath(resultsKeywords, pathParam, showHideable);

			let newState = {
				path,
				senna: true,
			};

			if (oldState) {
				newState = JSON.parse(JSON.stringify(oldState));

				newState.path = path;
			}

			window.history.replaceState(newState, document.title, path);
		}

		setRenderState({
			children: filterNodes(
				resultsKeywords,
				renderState.node.children,
				showHideable,
				renderState.viewType
			),
			filterClass: renderState.filterClass,
			id: renderState.id,
			node: renderState.node,
			page: renderState.page,
			showHideable,
			viewType: renderState.viewType,
		});
	};

	const renderExpiredBanner = () => {
		if (!expired) {
			return '';
		}

		return (
			<ClayAlert
				displayType="warning"
				spritemap={spritemap}
				title={Liferay.Language.get('out-of-date')}
			>
				{Liferay.Language.get(
					'this-publication-was-created-on-a-previous-liferay-version.-you-cannot-publish,-revert,-or-make-additional-changes'
				)}
			</ClayAlert>
		);
	};

	const renderManagementToolbar = () => {
		return (
			<ClayManagementToolbar
				className={
					renderState.viewType === VIEW_TYPE_CONTEXT
						? 'nav-item-expand'
						: ''
				}
			>
				{renderState.viewType === VIEW_TYPE_CHANGES && (
					<ClayManagementToolbar.Search
						onSubmit={(event) => {
							event.preventDefault();

							handleFiltersUpdate(searchTerms.trim());
						}}
						showMobile={searchMobile}
					>
						<ClayInput.Group>
							<ClayInput.GroupItem>
								<ClayInput
									aria-label={Liferay.Language.get('search')}
									className="form-control input-group-inset input-group-inset-after"
									disabled={changes.length === 0}
									onChange={(event) =>
										setSearchTerms(event.target.value)
									}
									placeholder={`${Liferay.Language.get(
										'search'
									)}...`}
									type="text"
									value={searchTerms}
								/>
								<ClayInput.GroupInsetItem after tag="span">
									<ClayButtonWithIcon
										className="navbar-breakpoint-d-none"
										disabled={changes.length === 0}
										displayType="unstyled"
										onClick={() => setSearchMobile(false)}
										spritemap={spritemap}
										symbol="times"
									/>
									<ClayButtonWithIcon
										displayType="unstyled"
										spritemap={spritemap}
										symbol="search"
										type="submit"
									/>
								</ClayInput.GroupInsetItem>
							</ClayInput.GroupItem>
						</ClayInput.Group>
					</ClayManagementToolbar.Search>
				)}
				<ClayManagementToolbar.ItemList>
					{renderState.viewType === VIEW_TYPE_CHANGES ? (
						<ClayManagementToolbar.Item className="navbar-breakpoint-d-none">
							<ClayButton
								className="nav-link nav-link-monospaced"
								disabled={changes.length === 0}
								displayType="unstyled"
								onClick={() => setSearchMobile(true)}
							>
								<ClayIcon
									spritemap={spritemap}
									symbol="search"
								/>
							</ClayButton>
						</ClayManagementToolbar.Item>
					) : (
						<ClayManagementToolbar.Item>
							<ClayDropDownWithItems
								items={[
									{
										items: [
											{
												active:
													getColumn() ===
													COLUMN_TITLE,
												label: Liferay.Language.get(
													'title'
												),
												onClick: () =>
													setColumnState(
														COLUMN_TITLE
													),
											},
										],
										label: Liferay.Language.get('order-by'),
										type: 'group',
									},
								]}
								spritemap={spritemap}
								trigger={
									<ClayButton
										className="nav-link"
										disabled={changes.length === 0}
										displayType="unstyled"
									>
										<span className="navbar-breakpoint-down-d-none">
											<span className="navbar-text-truncate">
												{Liferay.Language.get(
													'filter-and-order'
												)}
											</span>

											<ClayIcon
												className="inline-item inline-item-after"
												spritemap={spritemap}
												symbol="caret-bottom"
											/>
										</span>
										<span className="navbar-breakpoint-d-none">
											<ClayIcon
												spritemap={spritemap}
												symbol="filter"
											/>
										</span>
									</ClayButton>
								}
							/>
						</ClayManagementToolbar.Item>
					)}
					{renderState.viewType === VIEW_TYPE_CONTEXT && (
						<ClayManagementToolbar.Item
							data-tooltip-align="top"
							title={Liferay.Language.get(
								'reverse-sort-direction'
							)}
						>
							<ClayButton
								disabled={changes.length === 0}
								displayType="unstyled"
								onClick={() =>
									setAscendingState(!ascendingState)
								}
							>
								<ClayIcon
									spritemap={spritemap}
									symbol={
										ascendingState
											? 'order-list-down'
											: 'order-list-up'
									}
								/>
							</ClayButton>
						</ClayManagementToolbar.Item>
					)}
					{renderState.viewType === VIEW_TYPE_CONTEXT && (
						<ClayManagementToolbar.Item className="nav-item-expand" />
					)}
					<ClayManagementToolbar.Item className="simple-toggle-switch-reverse">
						<ClayToggle
							disabled={changes.length === 0}
							label={Liferay.Language.get('show-all-items')}
							onToggle={(showHideable) =>
								handleShowHideableToggle(showHideable)
							}
							toggled={renderState.showHideable}
						/>
					</ClayManagementToolbar.Item>
					{contextViewRef.current && (
						<ClayManagementToolbar.Item
							data-tooltip-align="top"
							title={Liferay.Language.get('display-style')}
						>
							<ClayDropDownWithItems
								alignmentPosition={Align.BottomLeft}
								items={[
									{
										active:
											renderState.viewType ===
											VIEW_TYPE_CHANGES,
										label: Liferay.Language.get('changes'),
										onClick: () =>
											handleNavigationUpdate({
												filterClass: FILTER_CLASS_EVERYTHING,
												nodeId: 0,
												viewType: VIEW_TYPE_CHANGES,
											}),
										symbolLeft: 'list',
									},
									{
										active:
											renderState.viewType ===
											VIEW_TYPE_CONTEXT,
										label: Liferay.Language.get('context'),
										onClick: () =>
											handleNavigationUpdate({
												filterClass: FILTER_CLASS_EVERYTHING,
												nodeId: 0,
												viewType: VIEW_TYPE_CONTEXT,
											}),
										symbolLeft: 'pages-tree',
									},
								]}
								spritemap={spritemap}
								trigger={
									<ClayButton
										className="nav-link nav-link-monospaced"
										disabled={changes.length === 0}
										displayType="unstyled"
									>
										<ClayIcon
											spritemap={spritemap}
											symbol={
												renderState.viewType ===
												VIEW_TYPE_CHANGES
													? 'list'
													: 'pages-tree'
											}
										/>
									</ClayButton>
								}
							/>
						</ClayManagementToolbar.Item>
					)}
					<ClayManagementToolbar.Item
						data-tooltip-align="top"
						title={Liferay.Language.get('comments')}
					>
						<ClayButton
							className={`nav-link nav-link-monospaced${
								showComments ? ' active' : ''
							}`}
							displayType="unstyled"
							onClick={() => setShowComments(!showComments)}
						>
							<ClayIcon spritemap={spritemap} symbol="comments" />
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>
			</ClayManagementToolbar>
		);
	};

	const renderPanel = () => {
		if (renderState.viewType === VIEW_TYPE_CHANGES) {
			return '';
		}

		const items = [];

		items.push(
			<ClayRadio
				label={Liferay.Language.get('everything')}
				value={FILTER_CLASS_EVERYTHING}
			/>
		);

		for (let i = 0; i < rootDisplayClasses.length; i++) {
			const className = rootDisplayClasses[i];

			if (
				!renderState.showHideable &&
				contextViewRef.current[className].hideable
			) {
				continue;
			}

			let label = className;

			if (label.includes('.')) {
				label = label.substring(
					label.lastIndexOf('.') + 1,
					label.length
				);
			}

			items.push(<ClayRadio label={label} value={className} />);
		}

		return (
			<div className="col-md-3">
				<div className="panel panel-secondary">
					<div className="panel-body">
						<ClayRadioGroup
							onSelectedValueChange={(filterClass) =>
								handleNavigationUpdate({
									filterClass,
									nodeId: 0,
								})
							}
							selectedValue={renderState.filterClass}
						>
							{items}
						</ClayRadioGroup>
					</div>
				</div>
			</div>
		);
	};

	const renderResultsBar = () => {
		if (renderState.viewType === VIEW_TYPE_CONTEXT || !resultsKeywords) {
			return '';
		}

		const items = [];

		items.push(
			<ClayResultsBar.Item>
				<span className="component-text text-truncate-inline">
					<span className="text-truncate">
						{Liferay.Util.sub(
							renderState.children &&
								renderState.children.length === 1
								? Liferay.Language.get('x-result-for')
								: Liferay.Language.get('x-results-for'),
							renderState.children
								? renderState.children.length.toString()
								: '0'
						)}
					</span>
				</span>
			</ClayResultsBar.Item>
		);

		items.push(
			<ClayResultsBar.Item>
				<ClayLabel
					className="component-label tbar-label"
					closeButtonProps={{
						onClick: () => {
							handleFiltersUpdate('');
							setSearchTerms('');
						},
					}}
					displayType="unstyled"
					spritemap={spritemap}
				>
					{Liferay.Language.get('keywords') + ': ' + resultsKeywords}
				</ClayLabel>
			</ClayResultsBar.Item>
		);

		items.push(<ClayResultsBar.Item expand />);
		items.push(
			<ClayResultsBar.Item>
				<ClayButton
					className="component-link tbar-link"
					displayType="unstyled"
					onClick={() => {
						handleFiltersUpdate('');
						setSearchTerms('');
					}}
				>
					{Liferay.Language.get('clear')}
				</ClayButton>
			</ClayResultsBar.Item>
		);

		return <ClayResultsBar>{items}</ClayResultsBar>;
	};

	const renderTable = () => {
		if (!renderState.children || renderState.children.length === 0) {
			if (
				renderState.node.children &&
				renderState.node.children.length > 0 &&
				renderState.viewType === VIEW_TYPE_CHANGES
			) {
				return (
					<div className="sheet taglib-empty-result-message">
						<div className="taglib-empty-search-result-message-header" />
						<div className="sheet-text text-center">
							{Liferay.Language.get(
								'there-are-no-changes-to-display-in-this-view'
							)}
						</div>
					</div>
				);
			}

			return '';
		}

		return (
			<>
				<ClayTable
					className="publications-table"
					headingNoWrap
					hover
					noWrap
				>
					{renderState.viewType === VIEW_TYPE_CHANGES && (
						<ClayTable.Head>
							<ClayTable.Row>
								<ClayTable.Cell headingCell>
									{getColumnHeader(
										COLUMN_USER,
										Liferay.Language.get('user')
									)}
								</ClayTable.Cell>
								<ClayTable.Cell headingCell>
									{getColumnHeader(
										COLUMN_SITE,
										Liferay.Language.get('site')
									)}
								</ClayTable.Cell>
								<ClayTable.Cell
									className="table-cell-expand"
									headingCell
								>
									{getColumnHeader(
										COLUMN_TITLE,
										Liferay.Language.get('title')
									)}
								</ClayTable.Cell>
								<ClayTable.Cell
									className="table-cell-expand-smallest"
									headingCell
								>
									{getColumnHeader(
										COLUMN_CHANGE_TYPE,
										Liferay.Language.get('change-type')
									)}
								</ClayTable.Cell>
								<ClayTable.Cell
									className="table-cell-expand-smallest"
									headingCell
								>
									{getColumnHeader(
										COLUMN_MODIFIED_DATE,
										Liferay.Language.get('last-modified')
									)}
								</ClayTable.Cell>
							</ClayTable.Row>
						</ClayTable.Head>
					)}

					<ClayTable.Body>
						{getTableRows(filterDisplayNodes(renderState.children))}
					</ClayTable.Body>
				</ClayTable>
				{renderState.children.length > 5 && (
					<ClayPaginationBarWithBasicItems
						activeDelta={deltaState}
						activePage={renderState.page}
						deltas={[4, 8, 20, 40, 60].map((size) => ({
							label: size,
						}))}
						ellipsisBuffer={3}
						onDeltaChange={(delta) => {
							setDeltaState(delta);
							setRenderState({
								children: renderState.children,
								filterClass: renderState.filterClass,
								id: renderState.id,
								node: renderState.node,
								page: 1,
								showHideable: renderState.showHideable,
								viewType: renderState.viewType,
							});
						}}
						onPageChange={(page) =>
							setRenderState({
								children: renderState.children,
								filterClass: renderState.filterClass,
								id: renderState.id,
								node: renderState.node,
								page,
								showHideable: renderState.showHideable,
								viewType: renderState.viewType,
							})
						}
						totalItems={renderState.children.length}
					/>
				)}
			</>
		);
	};

	const renderMainContent = () => {
		if (
			renderState.viewType === VIEW_TYPE_CONTEXT &&
			contextViewRef.current.errorMessage
		) {
			return (
				<ClayAlert displayType="danger">
					{contextViewRef.current.errorMessage}
				</ClayAlert>
			);
		}
		else if (changes.length === 0) {
			return (
				<div className="container-fluid container-fluid-max-xl">
					{renderExpiredBanner()}

					<div className="sheet taglib-empty-result-message">
						<div className="taglib-empty-result-message-header" />
						<div className="sheet-text text-center">
							{Liferay.Language.get('no-changes-were-found')}
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="container-fluid container-fluid-max-xl">
				{renderExpiredBanner()}

				<ClayBreadcrumb
					ellipsisBuffer={1}
					items={getBreadcrumbItems(
						renderState.filterClass,
						renderState.node,
						renderState.id,
						renderState.viewType
					)}
					spritemap={spritemap}
				/>

				<div className="publications-changes-content row">
					{renderPanel()}

					<div
						className={
							renderState.viewType === VIEW_TYPE_CHANGES
								? 'col-md-12'
								: 'col-md-9'
						}
					>
						{renderState.node.modelClassNameId && (
							<ChangeTrackingRenderView
								ctEntry={!!renderState.node.ctEntryId}
								dataURL={getDataURL(renderState.node)}
								defaultLocale={defaultLocale}
								description={
									renderState.node.description
										? renderState.node.description
										: renderState.node.typeName
								}
								discardURL={getDiscardURL(renderState.node)}
								getCache={() =>
									renderCache.current[
										renderState.node.modelClassNameId.toString() +
											'-' +
											renderState.node.modelClassPK.toString()
									]
								}
								showDropdown={
									activeCTCollection &&
									renderState.node.modelClassNameId
								}
								spritemap={spritemap}
								title={renderState.node.title}
								updateCache={(data) => {
									renderCache.current[
										renderState.node.modelClassNameId.toString() +
											'-' +
											renderState.node.modelClassPK.toString()
									] = data;

									setRenderState({
										children: renderState.children,
										filterClass: renderState.filterClass,
										id: renderState.id,
										node: renderState.node,
										page: renderState.page,
										showHideable: renderState.showHideable,
										viewType: renderState.viewType,
									});
								}}
							/>
						)}
						{renderTable()}
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			{renderManagementToolbar()}
			{renderResultsBar()}
			<div
				className={`sidenav-container sidenav-right ${
					showComments ? 'open' : 'closed'
				}`}
			>
				<div
					className="info-panel sidenav-menu-slider"
					style={
						showComments
							? {
									height: '100%',
									'min-height': '485px',
									width: '320px',
							  }
							: {}
					}
				>
					<div
						className="sidebar sidebar-light sidenav-menu"
						style={
							showComments
								? {
										height: '100%',
										'min-height': '485px',
										width: '320px',
								  }
								: {}
						}
					>
						{showComments && (
							<ChangeTrackingComments
								ctEntryId={0}
								currentUserId={currentUserId}
								deleteCommentURL={deleteCTCommentURL}
								getCache={() => {
									return commentsCache.current['0'];
								}}
								getCommentsURL={getCTCommentsURL}
								keyParam=""
								setShowComments={setShowComments}
								spritemap={spritemap}
								updateCache={(data) => {
									const cacheData = JSON.parse(
										JSON.stringify(data)
									);

									cacheData.updatedCommentId = null;

									commentsCache.current['0'] = cacheData;
								}}
								updateCommentURL={updateCTCommentURL}
							/>
						)}
					</div>
				</div>
				<div
					className="sidenav-content"
					style={
						showComments
							? {'min-height': '485px', 'padding-right': '320px'}
							: {}
					}
				>
					{renderMainContent()}
				</div>
			</div>
		</>
	);
};
