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

package com.liferay.portal.security.sso.openid.connect.persistence.service.impl;

import com.liferay.portal.aop.AopService;
import com.liferay.portal.security.sso.openid.connect.persistence.service.base.OpenIdConnectSessionLocalServiceBaseImpl;

import org.osgi.service.component.annotations.Component;

/**
 * The implementation of the open ID connect session local service.
 *
 * <p>
 * All custom service methods should be put in this class. Whenever methods are added, rerun ServiceBuilder to copy their definitions into the <code>com.liferay.portal.security.sso.openid.connect.persistence.service.OpenIdConnectSessionLocalService</code> interface.
 *
 * <p>
 * This is a local service. Methods of this service will not have security checks based on the propagated JAAS credentials because this service can only be accessed from within the same VM.
 * </p>
 *
 * @author Arthur Chan
 * @see OpenIdConnectSessionLocalServiceBaseImpl
 */
@Component(
	property = "model.class.name=com.liferay.portal.security.sso.openid.connect.persistence.model.OpenIdConnectSession",
	service = AopService.class
)
public class OpenIdConnectSessionLocalServiceImpl
	extends OpenIdConnectSessionLocalServiceBaseImpl {

	/**
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never reference this class directly. Use <code>com.liferay.portal.security.sso.openid.connect.persistence.service.OpenIdConnectSessionLocalService</code> via injection or a <code>org.osgi.util.tracker.ServiceTracker</code> or use <code>com.liferay.portal.security.sso.openid.connect.persistence.service.OpenIdConnectSessionLocalServiceUtil</code>.
	 */

}