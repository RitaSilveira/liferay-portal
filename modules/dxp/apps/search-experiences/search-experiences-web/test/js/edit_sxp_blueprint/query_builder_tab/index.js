/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {fireEvent, render} from '@testing-library/react';
import React from 'react';

import QueryBuilder from '../../../../src/main/resources/META-INF/resources/sxp_blueprint_admin/js/edit_sxp_blueprint/query_builder_tab';
import {SEARCHABLE_TYPES, SELECTED_SXP_ELEMENTS} from '../../mocks/data';

import '@testing-library/jest-dom/extend-expect';

jest.mock(
	'../../../../src/main/resources/META-INF/resources/sxp_blueprint_admin/js/shared/CodeMirrorEditor',
	() => ({onChange, value}) => (
		<textarea aria-label="text-area" onChange={onChange} value={value} />
	)
);

// Suppress act warning until @testing-library/react is updated past 9
// to use screen. See https://javascript.plainenglish.io/
// you-probably-dont-need-act-in-your-react-tests-2a0bcd2ad65c

const originalError = console.error;

beforeAll(() => {
	console.error = (...args) => {
		if (/Warning.*not wrapped in act/.test(args[0])) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});

function renderBuilder(props) {
	return render(
		<QueryBuilder
			frameworkConfig={{
				apply_indexer_clauses: false,
				searchable_asset_types: SEARCHABLE_TYPES.map(
					({className}) => className
				),
			}}
			onDeleteSXPElement={jest.fn()}
			onFrameworkConfigChange={jest.fn()}
			selectedSXPElements={SELECTED_SXP_ELEMENTS}
			{...props}
		/>
	);
}

describe('QueryBuilder', () => {
	global.URL.createObjectURL = jest.fn();

	it('renders the builder', () => {
		const {container} = renderBuilder();

		expect(container).not.toBeNull();
	});

	it('renders the title for the selected query element', async () => {
		const {findByText, getByText} = renderBuilder();

		await findByText('query-builder');

		SELECTED_SXP_ELEMENTS.map((sxpElement) =>
			getByText(sxpElement.sxpElementTemplateJSON.title['en_US'])
		);
	});

	it('renders the description for the selected query element', async () => {
		const {findByText, getByText} = renderBuilder();

		await findByText('query-builder');

		SELECTED_SXP_ELEMENTS.map((sxpElement) =>
			getByText(sxpElement.sxpElementTemplateJSON.description['en_US'])
		);
	});

	it('can collapse all the query elements', async () => {
		const {container, findByText, getByText} = renderBuilder();

		await findByText('query-builder');

		fireEvent.click(getByText('collapse-all'));

		expect(
			container.querySelectorAll('.configuration-form-list').length
		).toBe(0);
	});
});
