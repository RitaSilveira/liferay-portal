/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.saml.persistence.internal.upgrade.v1_1_1;

import com.liferay.portal.kernel.upgrade.UpgradeProcess;
import com.liferay.saml.persistence.internal.upgrade.v1_1_1.util.SamlSpSessionTable;

/**
 * @author Mika Koivisto
 * @author Brian Wing Shun Chan
 */
public class SamlSpSessionUpgradeProcess extends UpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		alter(
			SamlSpSessionTable.class,
			new AlterColumnType("assertionXml", "TEXT null"));
		alter(
			SamlSpSessionTable.class,
			new AlterColumnType("samlSpSessionKey", "VARCHAR(75) null"));
		alter(
			SamlSpSessionTable.class,
			new AlterColumnType("sessionIndex", "VARCHAR(75) null"));
	}

}