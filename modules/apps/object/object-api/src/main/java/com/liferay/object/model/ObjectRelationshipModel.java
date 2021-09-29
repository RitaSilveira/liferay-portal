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

package com.liferay.object.model;

import com.liferay.portal.kernel.bean.AutoEscape;
import com.liferay.portal.kernel.exception.LocaleException;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.LocalizedModel;
import com.liferay.portal.kernel.model.MVCCModel;
import com.liferay.portal.kernel.model.ShardedModel;
import com.liferay.portal.kernel.model.StagedAuditedModel;

import java.util.Date;
import java.util.Locale;
import java.util.Map;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The base model interface for the ObjectRelationship service. Represents a row in the &quot;ObjectRelationship&quot; database table, with each column mapped to a property of this class.
 *
 * <p>
 * This interface and its corresponding implementation <code>com.liferay.object.model.impl.ObjectRelationshipModelImpl</code> exist only as a container for the default property accessors generated by ServiceBuilder. Helper methods and all application logic should be put in <code>com.liferay.object.model.impl.ObjectRelationshipImpl</code>.
 * </p>
 *
 * @author Marco Leo
 * @see ObjectRelationship
 * @generated
 */
@ProviderType
public interface ObjectRelationshipModel
	extends BaseModel<ObjectRelationship>, LocalizedModel, MVCCModel,
			ShardedModel, StagedAuditedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. All methods that expect a object relationship model instance should use the {@link ObjectRelationship} interface instead.
	 */

	/**
	 * Returns the primary key of this object relationship.
	 *
	 * @return the primary key of this object relationship
	 */
	public long getPrimaryKey();

	/**
	 * Sets the primary key of this object relationship.
	 *
	 * @param primaryKey the primary key of this object relationship
	 */
	public void setPrimaryKey(long primaryKey);

	/**
	 * Returns the mvcc version of this object relationship.
	 *
	 * @return the mvcc version of this object relationship
	 */
	@Override
	public long getMvccVersion();

	/**
	 * Sets the mvcc version of this object relationship.
	 *
	 * @param mvccVersion the mvcc version of this object relationship
	 */
	@Override
	public void setMvccVersion(long mvccVersion);

	/**
	 * Returns the uuid of this object relationship.
	 *
	 * @return the uuid of this object relationship
	 */
	@AutoEscape
	@Override
	public String getUuid();

	/**
	 * Sets the uuid of this object relationship.
	 *
	 * @param uuid the uuid of this object relationship
	 */
	@Override
	public void setUuid(String uuid);

	/**
	 * Returns the object relationship ID of this object relationship.
	 *
	 * @return the object relationship ID of this object relationship
	 */
	public long getObjectRelationshipId();

	/**
	 * Sets the object relationship ID of this object relationship.
	 *
	 * @param objectRelationshipId the object relationship ID of this object relationship
	 */
	public void setObjectRelationshipId(long objectRelationshipId);

	/**
	 * Returns the company ID of this object relationship.
	 *
	 * @return the company ID of this object relationship
	 */
	@Override
	public long getCompanyId();

	/**
	 * Sets the company ID of this object relationship.
	 *
	 * @param companyId the company ID of this object relationship
	 */
	@Override
	public void setCompanyId(long companyId);

	/**
	 * Returns the user ID of this object relationship.
	 *
	 * @return the user ID of this object relationship
	 */
	@Override
	public long getUserId();

	/**
	 * Sets the user ID of this object relationship.
	 *
	 * @param userId the user ID of this object relationship
	 */
	@Override
	public void setUserId(long userId);

	/**
	 * Returns the user uuid of this object relationship.
	 *
	 * @return the user uuid of this object relationship
	 */
	@Override
	public String getUserUuid();

	/**
	 * Sets the user uuid of this object relationship.
	 *
	 * @param userUuid the user uuid of this object relationship
	 */
	@Override
	public void setUserUuid(String userUuid);

	/**
	 * Returns the user name of this object relationship.
	 *
	 * @return the user name of this object relationship
	 */
	@AutoEscape
	@Override
	public String getUserName();

	/**
	 * Sets the user name of this object relationship.
	 *
	 * @param userName the user name of this object relationship
	 */
	@Override
	public void setUserName(String userName);

	/**
	 * Returns the create date of this object relationship.
	 *
	 * @return the create date of this object relationship
	 */
	@Override
	public Date getCreateDate();

	/**
	 * Sets the create date of this object relationship.
	 *
	 * @param createDate the create date of this object relationship
	 */
	@Override
	public void setCreateDate(Date createDate);

	/**
	 * Returns the modified date of this object relationship.
	 *
	 * @return the modified date of this object relationship
	 */
	@Override
	public Date getModifiedDate();

	/**
	 * Sets the modified date of this object relationship.
	 *
	 * @param modifiedDate the modified date of this object relationship
	 */
	@Override
	public void setModifiedDate(Date modifiedDate);

	/**
	 * Returns the object definition id1 of this object relationship.
	 *
	 * @return the object definition id1 of this object relationship
	 */
	public long getObjectDefinitionId1();

	/**
	 * Sets the object definition id1 of this object relationship.
	 *
	 * @param objectDefinitionId1 the object definition id1 of this object relationship
	 */
	public void setObjectDefinitionId1(long objectDefinitionId1);

	/**
	 * Returns the object definition id2 of this object relationship.
	 *
	 * @return the object definition id2 of this object relationship
	 */
	public long getObjectDefinitionId2();

	/**
	 * Sets the object definition id2 of this object relationship.
	 *
	 * @param objectDefinitionId2 the object definition id2 of this object relationship
	 */
	public void setObjectDefinitionId2(long objectDefinitionId2);

	/**
	 * Returns the object field id2 of this object relationship.
	 *
	 * @return the object field id2 of this object relationship
	 */
	public long getObjectFieldId2();

	/**
	 * Sets the object field id2 of this object relationship.
	 *
	 * @param objectFieldId2 the object field id2 of this object relationship
	 */
	public void setObjectFieldId2(long objectFieldId2);

	/**
	 * Returns the deletion type of this object relationship.
	 *
	 * @return the deletion type of this object relationship
	 */
	@AutoEscape
	public String getDeletionType();

	/**
	 * Sets the deletion type of this object relationship.
	 *
	 * @param deletionType the deletion type of this object relationship
	 */
	public void setDeletionType(String deletionType);

	/**
	 * Returns the db table name of this object relationship.
	 *
	 * @return the db table name of this object relationship
	 */
	@AutoEscape
	public String getDBTableName();

	/**
	 * Sets the db table name of this object relationship.
	 *
	 * @param dbTableName the db table name of this object relationship
	 */
	public void setDBTableName(String dbTableName);

	/**
	 * Returns the label of this object relationship.
	 *
	 * @return the label of this object relationship
	 */
	public String getLabel();

	/**
	 * Returns the localized label of this object relationship in the language. Uses the default language if no localization exists for the requested language.
	 *
	 * @param locale the locale of the language
	 * @return the localized label of this object relationship
	 */
	@AutoEscape
	public String getLabel(Locale locale);

	/**
	 * Returns the localized label of this object relationship in the language, optionally using the default language if no localization exists for the requested language.
	 *
	 * @param locale the local of the language
	 * @param useDefault whether to use the default language if no localization exists for the requested language
	 * @return the localized label of this object relationship. If <code>useDefault</code> is <code>false</code> and no localization exists for the requested language, an empty string will be returned.
	 */
	@AutoEscape
	public String getLabel(Locale locale, boolean useDefault);

	/**
	 * Returns the localized label of this object relationship in the language. Uses the default language if no localization exists for the requested language.
	 *
	 * @param languageId the ID of the language
	 * @return the localized label of this object relationship
	 */
	@AutoEscape
	public String getLabel(String languageId);

	/**
	 * Returns the localized label of this object relationship in the language, optionally using the default language if no localization exists for the requested language.
	 *
	 * @param languageId the ID of the language
	 * @param useDefault whether to use the default language if no localization exists for the requested language
	 * @return the localized label of this object relationship
	 */
	@AutoEscape
	public String getLabel(String languageId, boolean useDefault);

	@AutoEscape
	public String getLabelCurrentLanguageId();

	@AutoEscape
	public String getLabelCurrentValue();

	/**
	 * Returns a map of the locales and localized labels of this object relationship.
	 *
	 * @return the locales and localized labels of this object relationship
	 */
	public Map<Locale, String> getLabelMap();

	/**
	 * Sets the label of this object relationship.
	 *
	 * @param label the label of this object relationship
	 */
	public void setLabel(String label);

	/**
	 * Sets the localized label of this object relationship in the language.
	 *
	 * @param label the localized label of this object relationship
	 * @param locale the locale of the language
	 */
	public void setLabel(String label, Locale locale);

	/**
	 * Sets the localized label of this object relationship in the language, and sets the default locale.
	 *
	 * @param label the localized label of this object relationship
	 * @param locale the locale of the language
	 * @param defaultLocale the default locale
	 */
	public void setLabel(String label, Locale locale, Locale defaultLocale);

	public void setLabelCurrentLanguageId(String languageId);

	/**
	 * Sets the localized labels of this object relationship from the map of locales and localized labels.
	 *
	 * @param labelMap the locales and localized labels of this object relationship
	 */
	public void setLabelMap(Map<Locale, String> labelMap);

	/**
	 * Sets the localized labels of this object relationship from the map of locales and localized labels, and sets the default locale.
	 *
	 * @param labelMap the locales and localized labels of this object relationship
	 * @param defaultLocale the default locale
	 */
	public void setLabelMap(Map<Locale, String> labelMap, Locale defaultLocale);

	/**
	 * Returns the name of this object relationship.
	 *
	 * @return the name of this object relationship
	 */
	@AutoEscape
	public String getName();

	/**
	 * Sets the name of this object relationship.
	 *
	 * @param name the name of this object relationship
	 */
	public void setName(String name);

	/**
	 * Returns the type of this object relationship.
	 *
	 * @return the type of this object relationship
	 */
	@AutoEscape
	public String getType();

	/**
	 * Sets the type of this object relationship.
	 *
	 * @param type the type of this object relationship
	 */
	public void setType(String type);

	@Override
	public String[] getAvailableLanguageIds();

	@Override
	public String getDefaultLanguageId();

	@Override
	public void prepareLocalizedFieldsForImport() throws LocaleException;

	@Override
	public void prepareLocalizedFieldsForImport(Locale defaultImportLocale)
		throws LocaleException;

	@Override
	public ObjectRelationship cloneWithOriginalValues();

}