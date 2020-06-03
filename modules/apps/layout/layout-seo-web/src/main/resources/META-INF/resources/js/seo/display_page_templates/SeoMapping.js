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

import ClayForm, {ClayInput} from '@clayui/form';
import React, {useState} from 'react';

import MappingPanel from './MappingPanel';

function SeoMapping({fields, selectedSource}) {
	const [title, setTitle] = useState('');

	const handleMappingTitle = ({field, source}) => {
		setTitle(`${source.label}: ${field.label}`);
	};

	return (
		<>
			<ClayForm.Group>
				<label className="dpt-mapping-label" htmlFor="titleSelector">
					<div className="control-label">
						{Liferay.Language.get('html-title')}
					</div>
					<ClayInput.Group>
						<ClayInput.GroupItem>
							<ClayInput
								className="dpt-mapping-input"
								id="title"
								readOnly
								type="text"
								value={title}
							/>
						</ClayInput.GroupItem>
						<ClayInput.GroupItem shrink>
							<MappingPanel
								fields={fields}
								initialSelectedField={fields[0]}
								initialSelectedSource={selectedSource}
								onChange={handleMappingTitle}
							/>
						</ClayInput.GroupItem>
					</ClayInput.Group>
				</label>
			</ClayForm.Group>
		</>
	);
}

export default function (props) {
	return (
		<SeoMapping
			{...props}
			portletNamespace={`_${props.portletNamespace}_`}
		/>
	);
}
